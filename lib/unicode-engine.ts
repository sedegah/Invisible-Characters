/* ------------------------------------
   Unicode character detection engine
   Detects invisible and suspicious Unicode characters
------------------------------------ */

export interface DetectedChar {
  char: string
  codePoint: number
  name: string
}

const invisibleMap: Record<number, string> = {
  0x0000: "NULL (␀)",
  0x0008: "BACKSPACE (BS)",
  0x0009: "TAB (→)",
  0x000b: "VERTICAL TAB (VT)",
  0x000c: "FORM FEED (FF)",
  0x001c: "FILE SEPARATOR (FS)",
  0x001d: "GROUP SEPARATOR (GS)",
  0x001e: "RECORD SEPARATOR (RS)",
  0x001f: "UNIT SEPARATOR (US)",
  0x00a0: "NON-BREAKING SPACE (NBSP)",
  0x00ad: "SOFT HYPHEN (SHY)",
  0x034f: "COMBINING GRAPHEME JOINER (CGJ)",
  0x061c: "ARABIC LETTER MARK (ALM)",
  0x115f: "HANGUL CHOSEONG FILLER (HCF)",
  0x1160: "HANGUL JUNGSEONG FILLER (HJF)",
  0x1680: "OGHAM SPACE MARK (OGSP)",
  0x17b4: "KHMER VOWEL INHERENT AQ (KVAQ)",
  0x17b5: "KHMER VOWEL INHERENT AA (KVAA)",
  0x180e: "MONGOLIAN VOWEL SEPARATOR (MVS)",
  0x2000: "EN QUAD (NQSP)",
  0x2001: "EM QUAD (MQSP)",
  0x2002: "EN SPACE (ENSP)",
  0x2003: "EM SPACE (EMSP)",
  0x2004: "THREE-PER-EM SPACE (3/MSP)",
  0x2005: "FOUR-PER-EM SPACE (4/MSP)",
  0x2006: "SIX-PER-EM SPACE (6/MSP)",
  0x2007: "FIGURE SPACE (FSP)",
  0x2008: "PUNCTUATION SPACE (PSP)",
  0x2009: "THIN SPACE (THSP)",
  0x200a: "HAIR SPACE (HSP)",
  0x200b: "ZERO WIDTH SPACE (ZWSP)",
  0x200c: "ZERO WIDTH NON-JOINER (ZWNJ)",
  0x200d: "ZERO WIDTH JOINER (ZWJ)",
  0x200e: "LEFT-TO-RIGHT MARK (LRM)",
  0x200f: "RIGHT-TO-LEFT MARK (RLM)",
  0x2028: "LINE SEPARATOR (LS)",
  0x2029: "PARAGRAPH SEPARATOR (PS)",
  0x202a: "LEFT-TO-RIGHT EMBEDDING (LRE)",
  0x202b: "RIGHT-TO-LEFT EMBEDDING (RLE)",
  0x202c: "POP DIRECTIONAL FORMATTING (PDF)",
  0x202d: "LEFT-TO-RIGHT OVERRIDE (LRO)",
  0x202e: "RIGHT-TO-LEFT OVERRIDE (RLO)",
  0x202f: "NARROW NO-BREAK SPACE (NNBSP)",
  0x205f: "MEDIUM MATHEMATICAL SPACE (MMSP)",
  0x2060: "WORD JOINER (WJ)",
  0x2061: "FUNCTION APPLICATION (FA)",
  0x2062: "INVISIBLE TIMES (IT)",
  0x2063: "INVISIBLE SEPARATOR (IS)",
  0x2064: "INVISIBLE PLUS (IP)",
  0x2065: "RESERVED (RSV)",
  0x2066: "LEFT-TO-RIGHT ISOLATE (LRI)",
  0x2067: "RIGHT-TO-LEFT ISOLATE (RLI)",
  0x2068: "FIRST STRONG ISOLATE (FSI)",
  0x2069: "POP DIRECTIONAL ISOLATE (PDI)",
  0x206a: "INHIBIT SYMMETRIC SWAPPING (ISS)",
  0x206b: "ACTIVATE SYMMETRIC SWAPPING (ASS)",
  0x206c: "INHIBIT ARABIC FORM SHAPING (IAFS)",
  0x206d: "ACTIVATE ARABIC FORM SHAPING (AAFS)",
  0x206e: "NATIONAL DIGIT SHAPES (NDS)",
  0x206f: "NOMINAL DIGIT SHAPES (NODS)",
  0x2800: "BRAILLE PATTERN BLANK (BPB)",
  0x3000: "IDEOGRAPHIC SPACE (IDSP)",
  0x3164: "HANGUL FILLER (HF)",
  0xfeff: "BYTE ORDER MARK (BOM)",
  0xffa0: "HALFWIDTH HANGUL FILLER (HWHF)",
  0xfffc: "OBJECT REPLACEMENT CHARACTER (OBJ)",
}

const isSuspiciousControlCharacter = (codePoint: number) => {
  if (codePoint >= 0x007f && codePoint <= 0x009f) {
    return true
  }

  if (codePoint >= 0x0000 && codePoint <= 0x001f) {
    return ![0x0009, 0x000a, 0x000d].includes(codePoint)
  }

  return false
}

/* ------------------------------------
   Main detection function with proper cleanup
------------------------------------ */
export const detectInvisibleCharacters = (text: string) => {
  const characters: DetectedChar[] = []
  const charsToRemove = new Set<string>()

  // First pass: detect all invisible characters
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)

    if (invisibleMap[codePoint] || isSuspiciousControlCharacter(codePoint)) {
      characters.push({
        char: chars,
        codePoint,
        name: invisibleMap[codePoint] || "CONTROL CHARACTER",
      })
    }
    i += charCount - 1
  }

  // Build a set of characters to remove (by their string representation)
  characters.forEach((char) => {
    charsToRemove.add(char.char)
  })

  // Second pass: rebuild text, removing all invisible characters
  let cleanedText = ""
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)

    if (!charsToRemove.has(chars)) {
      cleanedText += chars
    }
    i += charCount - 1
  }

  return { characters, cleanedText }
}

/* ------------------------------------
   Get detailed information about characters
------------------------------------ */
export const getCharacterDetails = (text: string) => {
  const characters: Array<{
    index: number
    char: string
    codePoint: number
    codePointHex: string
    name: string
    category: string
    isInvisible: boolean
  }> = []

  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)
    const isInvisible = !!invisibleMap[codePoint] || isSuspiciousControlCharacter(codePoint)

    characters.push({
      index: i,
      char: chars,
      codePoint,
      codePointHex: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      name: invisibleMap[codePoint] || (isInvisible ? "CONTROL CHARACTER" : "REGULAR CHARACTER"),
      category: isInvisible ? "Control/Format" : "Printable",
      isInvisible,
    })

    i += charCount - 1
  }

  return characters
}

/* ------------------------------------
   Generate highlighted text with markers
------------------------------------ */
export const generateHighlightedText = (text: string, detectedChars: DetectedChar[]): string => {
  let highlighted = ""
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)
    highlighted += detectedChars.find((c) => c.char === chars) ? "⦿" : chars
    i += charCount - 1
  }
  return highlighted
}

/* ------------------------------------
   Aggressive cleanup - removes all control and formatting chars
------------------------------------ */
export const aggressiveCleanup = (text: string): string => {
  let cleaned = ""
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)

    // Check if it's in our invisible map
    if (!invisibleMap[codePoint] && !isSuspiciousControlCharacter(codePoint)) {
      cleaned += chars
    }
    i += charCount - 1
  }
  return cleaned
}
