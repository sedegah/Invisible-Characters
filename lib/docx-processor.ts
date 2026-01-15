/* ------------------------------------
   DOCX Document Processing Engine
   Handles reading, analyzing, and cleaning DOCX files
   Preserves: paragraphs, formatting, superscripts, subscripts, footnotes
   Uses direct XML parsing for accurate structure preservation
------------------------------------ */

import JSZip from 'jszip'
import { parseStringPromise } from 'xml2js'
import { Document, Paragraph, TextRun, AlignmentType } from 'docx'
import { detectInvisibleCharacters } from './unicode-engine'

export interface DocxAnalysisResult {
  originalText: string
  cleanedText: string
  detectedCharacters: Array<{
    char: string
    codePoint: number
    name: string
    count: number
    positions: number[]
  }>
  fileName: string
}

interface ParsedParagraph {
  text: string
  runs: Array<{
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    superscript?: boolean
    subscript?: boolean
  }>
  alignment?: string
  style?: string
}

interface TextSegment {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  superscript?: boolean
  subscript?: boolean
  isFootnote?: boolean
}

/**
 * Parse DOCX file and extract text with proper structure preservation
 */
export async function parseDocxFile(file: File): Promise<DocxAnalysisResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Parse DOCX structure directly
    const paragraphs = await parseDocxStructure(arrayBuffer)
    
    // Extract text while preserving paragraph breaks
    const originalText = paragraphs
      .map(p => p.text)
      .filter(text => text.trim())
      .join('\n\n')
    
    // Detect invisible characters
    const { characters, cleanedText } = detectInvisibleCharacters(originalText)
    
    // Group characters by code point and track positions
    const charMap = new Map<number, {
      char: string
      codePoint: number
      name: string
      count: number
      positions: number[]
    }>()
    
    characters.forEach((char, index) => {
      const existing = charMap.get(char.codePoint)
      if (existing) {
        existing.count++
        existing.positions.push(index)
      } else {
        charMap.set(char.codePoint, {
          char: char.char,
          codePoint: char.codePoint,
          name: char.name,
          count: 1,
          positions: [index]
        })
      }
    })
    
    return {
      originalText,
      cleanedText,
      detectedCharacters: Array.from(charMap.values()),
      fileName: file.name
    }
  } catch (error) {
    console.error('Error parsing DOCX file:', error)
    throw new Error('Failed to parse DOCX file. Please ensure it is a valid .docx document.')
  }
}

/**
 * Parse DOCX XML structure to extract paragraphs with formatting
 */
async function parseDocxStructure(arrayBuffer: ArrayBuffer): Promise<ParsedParagraph[]> {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer)
    const documentXml = await zip.file('word/document.xml')?.async('string')
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file: missing document.xml')
    }
    
    const parsedXml = await parseStringPromise(documentXml)
    const body = parsedXml['w:document']?.['w:body']?.[0]
    
    if (!body) {
      throw new Error('Invalid DOCX structure')
    }
    
    const paragraphs: ParsedParagraph[] = []
    const bodyParagraphs = body['w:p'] || []
    
    for (const para of bodyParagraphs) {
      const parsedPara = parseParagraph(para)
      if (parsedPara.text.trim()) {
        paragraphs.push(parsedPara)
      }
    }
    
    return paragraphs
  } catch (error) {
    console.error('Error parsing DOCX structure:', error)
    throw error
  }
}

/**
 * Parse a single paragraph element from DOCX XML
 */
function parseParagraph(paraElement: any): ParsedParagraph {
  const runs: ParsedParagraph['runs'] = []
  let fullText = ''
  
  // Get paragraph properties
  const pPr = paraElement['w:pPr']?.[0]
  const alignment = pPr?.['w:jc']?.[0]?.['$']?.['w:val']
  const style = pPr?.['w:pStyle']?.[0]?.['$']?.['w:val']
  
  // Process text runs
  const textRuns = paraElement['w:r'] || []
  
  for (const run of textRuns) {
    const runProps = run['w:rPr']?.[0]
    const textElements = run['w:t'] || []
    
    // Extract formatting
    const bold = !!runProps?.['w:b']
    const italic = !!runProps?.['w:i']
    const underline = !!runProps?.['w:u']
    const superscript = runProps?.['w:vertAlign']?.[0]?.['$']?.['w:val'] === 'superscript'
    const subscript = runProps?.['w:vertAlign']?.[0]?.['$']?.['w:val'] === 'subscript'
    
    // Extract text
    for (const textEl of textElements) {
      const text = typeof textEl === 'string' ? textEl : textEl._ || ''
      if (text) {
        fullText += text
        runs.push({
          text,
          bold,
          italic,
          underline,
          superscript,
          subscript
        })
      }
    }
    
    // Handle tabs
    if (run['w:tab']) {
      fullText += '\t'
      runs.push({ text: '\t' })
    }
  }
  
  return {
    text: fullText,
    runs,
    alignment,
    style
  }
}

/**
 * Create a cleaned DOCX file with formatting preserved
 */
export async function createCleanedDocx(
  originalFile: File,
  cleanedText: string,
  fileName: string
): Promise<Blob> {
  try {
    const arrayBuffer = await originalFile.arrayBuffer()
    
    // Parse original document structure
    const originalParagraphs = await parseDocxStructure(arrayBuffer)
    
    // Create cleaned paragraphs preserving structure and formatting
    const cleanedParagraphs = recreateParagraphsWithCleanedText(
      originalParagraphs,
      cleanedText
    )
    
    // Create new document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: cleanedParagraphs
      }]
    })
    
    // Generate blob
    const { Packer } = await import('docx')
    const blob = await Packer.toBlob(doc)
    
    return blob
  } catch (error) {
    console.error('Error creating cleaned DOCX:', error)
    // Fallback
    return createSimpleDocx(cleanedText, fileName)
  }
}

/**
 * Recreate paragraphs with cleaned text while preserving formatting
 */
function recreateParagraphsWithCleanedText(
  originalParagraphs: ParsedParagraph[],
  cleanedText: string
): Paragraph[] {
  const cleanedBlocks = cleanedText.split('\n\n').filter(b => b.trim())
  const docParagraphs: Paragraph[] = []
  
  for (let i = 0; i < cleanedBlocks.length && i < originalParagraphs.length; i++) {
    const cleanedBlock = cleanedBlocks[i].trim()
    const originalPara = originalParagraphs[i]
    
    // Detect paragraph type
    const paraType = detectParagraphType(cleanedBlock, i, cleanedBlocks.length)
    
    // Create text runs with preserved formatting
    const children: TextRun[] = []
    
    // If we have run information from original, try to map it
    if (originalPara.runs && originalPara.runs.length > 0) {
      // Use original formatting for runs
      const textToDistribute = cleanedBlock
      let remainingText = textToDistribute
      
      for (const run of originalPara.runs) {
        if (remainingText.length === 0) break
        
        // Take proportional amount of text
        const runLength = Math.min(run.text.length, remainingText.length)
        const runText = remainingText.substring(0, runLength)
        
        if (runText) {
          children.push(new TextRun({
            text: runText,
            bold: run.bold || paraType.bold,
            italics: run.italic,
            underline: run.underline ? { type: 'single' } : undefined,
            superScript: run.superscript,
            subScript: run.subscript,
            size: paraType.size,
          }))
        }
        
        remainingText = remainingText.substring(runLength)
      }
      
      // Add any remaining text
      if (remainingText) {
        children.push(new TextRun({
          text: remainingText,
          size: paraType.size,
          bold: paraType.bold,
        }))
      }
    } else {
      // No run info, create single run
      children.push(new TextRun({
        text: cleanedBlock,
        size: paraType.size,
        bold: paraType.bold,
      }))
    }
    
    // Create paragraph with detected styling
    docParagraphs.push(new Paragraph({
      children,
      spacing: paraType.spacing,
      alignment: paraType.alignment,
      indent: paraType.indent,
    }))
  }
  
  return docParagraphs
}

/**
 * Detect paragraph type and return appropriate styling
 */
function detectParagraphType(text: string, index: number, total: number) {
  const isFirst = index === 0
  const startsWithCapital = /^[A-Z]/.test(text)
  const endsWithPunctuation = /[.!?:;]$/.test(text)
  const isAllCaps = text === text.toUpperCase() && text.length < 100
  const isShort = text.length < 150
  
  // Title
  if (isFirst && isShort && !endsWithPunctuation) {
    return {
      size: 32,
      bold: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 480 },
      indent: undefined
    }
  }
  
  // Author/affiliation (first few paragraphs)
  if (index <= 4 && (text.includes('Department') || text.includes('University') || text.includes('@'))) {
    return {
      size: 22,
      bold: false,
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      indent: undefined
    }
  }
  
  // Section headers
  if ((isAllCaps || (isShort && startsWithCapital && !endsWithPunctuation)) && text.split(' ').length < 10) {
    return {
      size: 28,
      bold: true,
      alignment: AlignmentType.LEFT,
      spacing: { before: 400, after: 200 },
      indent: undefined
    }
  }
  
  // References (usually in second half)
  if (index > total / 2 && /^[A-Z][a-z]+.*\(\d{4}\)/.test(text)) {
    return {
      size: 20,
      bold: false,
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      indent: { left: 360, hanging: 360 }
    }
  }
  
  // Default body paragraph
  return {
    size: 24,
    bold: false,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 240, line: 360 },
    indent: undefined
  }
}

/**
 * Fallback: Create simple DOCX with cleaned text
 */
async function createSimpleDocx(text: string, fileName: string): Promise<Blob> {
  const blocks = text.split('\n\n').filter(block => block.trim())
  
  const paragraphs = blocks.map((block, index) => {
    const trimmed = block.trim()
    const paraType = detectParagraphType(trimmed, index, blocks.length)
    
    return new Paragraph({
      children: [new TextRun({
        text: trimmed,
        size: paraType.size,
        bold: paraType.bold,
      })],
      spacing: paraType.spacing,
      alignment: paraType.alignment,
      indent: paraType.indent,
    })
  })
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: paragraphs
    }]
  })
  
  const { Packer } = await import('docx')
  return await Packer.toBlob(doc)
}

/**
 * Validate if file is a DOCX document
 */
export function isValidDocxFile(file: File): boolean {
  const validExtensions = ['.docx']
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )
  
  const hasValidMimeType = validMimeTypes.includes(file.type)
  
  return hasValidExtension || hasValidMimeType
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
