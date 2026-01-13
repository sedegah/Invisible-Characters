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
  0x0009: "TAB (→)",
  0x000a: "LINE FEED (↵)",
  0x000d: "CARRIAGE RETURN (⏎)",
  0x00a0: "NON-BREAKING SPACE (NBSP)",
  0x00ad: "SOFT HYPHEN (SHY)",
  0x200b: "ZERO WIDTH SPACE (ZWSP)",
  0x200c: "ZERO WIDTH NON-JOINER (ZWNJ)",
  0x200d: "ZERO WIDTH JOINER (ZWJ)",
  0x200e: "LEFT-TO-RIGHT MARK (LRM)",
  0x200f: "RIGHT-TO-LEFT MARK (RLM)",
  0x2028: "LINE SEPARATOR (LS)",
  0x2029: "PARAGRAPH SEPARATOR (¶)",
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
  0x2066: "LEFT-TO-RIGHT ISOLATE (LRI)",
  0x2067: "RIGHT-TO-LEFT ISOLATE (RLI)",
  0x2068: "FIRST STRONG ISOLATE (FSI)",
  0x2069: "POP DIRECTIONAL ISOLATE (PDI)",
  0x3000: "IDEOGRAPHIC SPACE (IDSP)",
  0xfeff: "BYTE ORDER MARK (BOM)",
}

/* ------------------------------------
   Main detection function
------------------------------------ */
export const detectInvisibleCharacters = (text: string) => {
  const characters: DetectedChar[] = []
  const indicesToRemove = new Set<number>()

  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i)!
    const charCount = codePoint > 0xffff ? 2 : 1
    const chars = text.slice(i, i + charCount)

    if (invisibleMap[codePoint]) {
      characters.push({ char: chars, codePoint, name: invisibleMap[codePoint] })
      for (let j = i; j < i + charCount; j++) indicesToRemove.add(j)
    }
    i += charCount - 1
  }

  const cleanedText = Array.from(text)
    .filter((_, idx) => !indicesToRemove.has(idx))
    .join("")

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
