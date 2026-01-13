// Unicode character detection engine
// Detects invisible and suspicious Unicode characters in text

interface DetectedChar {
  char: string
  codePoint: number
  name: string
}

const invisibleMap: Record<number, string> = {
  0: "NULL (␀)",
  9: "TAB (→)",
  10: "LINE FEED (↵)",
  13: "CARRIAGE RETURN (⏎)",
  160: "NON-BREAKING SPACE (NBSP)",
  173: "SOFT HYPHEN (SHY)",
  8203: "ZERO WIDTH SPACE (ZWSP)",
  8204: "ZERO WIDTH NON-JOINER (ZWNJ)",
  8205: "ZERO WIDTH JOINER (ZWJ)",
  8206: "LEFT-TO-RIGHT MARK (LRM)",
  8207: "RIGHT-TO-LEFT MARK (RLM)",
  8232: "LINE SEPARATOR (LS)",
  8233: "PARAGRAPH SEPARATOR (¶)",
  8234: "LEFT-TO-RIGHT EMBEDDING (LRE)",
  8235: "RIGHT-TO-LEFT EMBEDDING (RLE)",
  8236: "POP DIRECTIONAL FORMATTING (PDF)",
  8237: "LEFT-TO-RIGHT OVERRIDE (LRO)",
  8238: "RIGHT-TO-LEFT OVERRIDE (RLO)",
  8239: "NARROW NO-BREAK SPACE (NNBSP)",
  8287: "MEDIUM MATHEMATICAL SPACE (MMSP)",
  8288: "WORD JOINER (WJ)",
  8289: "FUNCTION APPLICATION (FA)",
  8290: "INVISIBLE TIMES (IT)",
  8291: "INVISIBLE SEPARATOR (IS)",
  8292: "INVISIBLE PLUS (IP)",
  8294: "LEFT-TO-RIGHT ISOLATE (LRI)",
  8295: "RIGHT-TO-LEFT ISOLATE (RLI)",
  8296: "FIRST STRONG ISOLATE (FSI)",
  8297: "POP DIRECTIONAL ISOLATE (PDI)",
  12288: "IDEOGRAPHIC SPACE (IDSP)",
  65279: "BYTE ORDER MARK (BOM)",
}

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
