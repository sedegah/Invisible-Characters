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
  0x17b4: "KHMER VOWEL INHERENT AQ (KVA)",
  0x17b5: "KHMER VOWEL INHERENT AA (KVB)",
  0x180e: "MONGOLIAN VOWEL SEPARATOR (MVS)",
  0x200b: "ZERO WIDTH SPACE (ZWSP)",
  0x200c: "ZERO WIDTH NON-JOINER (ZWNJ)",
  0x200d: "ZERO WIDTH JOINER (ZWJ)",
  0x200e: "LEFT-TO-RIGHT MARK (LRM)",
  0x200f: "RIGHT-TO-LEFT MARK (RLM)",
  0x202a: "LEFT-TO-RIGHT EMBEDDING (LRE)",
  0x202b: "RIGHT-TO-LEFT EMBEDDING (RLE)",
  0x202c: "POP DIRECTIONAL FORMATTING (PDF)",
  0x202d: "LEFT-TO-RIGHT OVERRIDE (LRO)",
  0x202e: "RIGHT-TO-LEFT OVERRIDE (RLO)",
  0x2060: "WORD JOINER (WJ)",
  0x2061: "FUNCTION APPLICATION (FA)",
  0x2062: "INVISIBLE TIMES (IT)",
  0x2063: "INVISIBLE SEPARATOR (IS)",
  0x2064: "INVISIBLE PLUS (IP)",
  0x2066: "LEFT-TO-RIGHT ISOLATE (LRI)",
  0x2067: "RIGHT-TO-LEFT ISOLATE (RLI)",
  0x2068: "FIRST STRONG ISOLATE (FSI)",
  0x2069: "POP DIRECTIONAL ISOLATE (PDI)",
  0x206a: "INHIBIT SYMMETRIC SWAPPING (ISS)",
  0x206b: "ACTIVATE SYMMETRIC SWAPPING (ASS)",
  0x206c: "INHIBIT ARABIC FORM SHAPING (IAFS)",
  0x206d: "ACTIVATE ARABIC FORM SHAPING (AAFS)",
  0x206e: "NATIONAL DIGIT SHAPES (NDS)",
  0x206f: "NOMINAL DIGIT SHAPES (NNDS)",
  0x2070: "SUPERSCRIPT ZERO (SS0)",
  0x2071: "SUPERSCRIPT LATIN SMALL LETTER I (SSI)",
  0x2074: "SUPERSCRIPT FOUR (SS4)",
  0x2075: "SUPERSCRIPT FIVE (SS5)",
  0x2076: "SUPERSCRIPT SIX (SS6)",
  0x2077: "SUPERSCRIPT SEVEN (SS7)",
  0x2078: "SUPERSCRIPT EIGHT (SS8)",
  0x2079: "SUPERSCRIPT NINE (SS9)",
  0x207f: "SUPERSCRIPT LATIN SMALL LETTER N (SSLSN)",
  0x2080: "SUBSCRIPT ZERO (SUB0)",
  0x2081: "SUBSCRIPT ONE (SUB1)",
  0x2082: "SUBSCRIPT TWO (SUB2)",
  0x2083: "SUBSCRIPT THREE (SUB3)",
  0x2084: "SUBSCRIPT FOUR (SUB4)",
  0x2085: "SUBSCRIPT FIVE (SUB5)",
  0x2086: "SUBSCRIPT SIX (SUB6)",
  0x2087: "SUBSCRIPT SEVEN (SUB7)",
  0x2088: "SUBSCRIPT EIGHT (SUB8)",
  0x2089: "SUBSCRIPT NINE (SUB9)",
  0x202f: "NARROW NO-BREAK SPACE (NNBSP)",
  0x205f: "MEDIUM MATHEMATICAL SPACE (MMSP)",
  0x2028: "LINE SEPARATOR (LS)",
  0x2029: "PARAGRAPH SEPARATOR (PS)",
  0x3000: "IDEOGRAPHIC SPACE (IDSP)",
  0xfeff: "BYTE ORDER MARK (BOM)",
  0xfff9: "INTERLINEAR ANNOTATION ANCHOR (IAA)",
  0xfffa: "INTERLINEAR ANNOTATION SEPARATOR (IAS)",
  0xfffb: "INTERLINEAR ANNOTATION TERMINATOR (IAT)",
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

    if (invisibleMap[codePoint]) {
      characters.push({ char: chars, codePoint, name: invisibleMap[codePoint] })
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
    const isInvisible = !!invisibleMap[codePoint]

    characters.push({
      index: i,
      char: chars,
      codePoint,
      codePointHex: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      name: invisibleMap[codePoint] || "REGULAR CHARACTER",
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
    if (!invisibleMap[codePoint]) {
      // Also filter out most control characters (0x0000-0x001F, 0x007F-0x009F)
      if ((codePoint >= 0x0000 && codePoint <= 0x001f) || (codePoint >= 0x007f && codePoint <= 0x009f)) {
        // Skip control characters except common ones like tab, newline, carriage return
        if (![0x0009, 0x000a, 0x000d].includes(codePoint)) {
          i += charCount - 1
          continue
        }
      }
      cleaned += chars
    }
    i += charCount - 1
  }
  return cleaned
}
