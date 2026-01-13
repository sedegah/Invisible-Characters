"use client"

import { useState, useEffect } from "react"
import { Copy, Download, Search, RotateCcw } from "lucide-react"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { detectInvisibleCharacters, getCharacterDetails, generateHighlightedText, type DetectedChar } from "@/lib/unicode-engine"

interface UnicodeInfo {
  char: string
  code: number
  hex: string
  name: string
  category: string
  block: string
}

export default function UnicodeScannerContent() {
  const [inputText, setInputText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [characters, setCharacters] = useState<UnicodeInfo[]>([])
  const [selectedChar, setSelectedChar] = useState<UnicodeInfo | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [detectedInvisible, setDetectedInvisible] = useState<DetectedChar[]>([])
  const [highlightedText, setHighlightedText] = useState("")
  const [cleanedText, setCleanedText] = useState("")

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("unicode-scanner-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // Save history to localStorage
  const saveToHistory = (text: string) => {
    const updated = [text, ...history].slice(0, 10)
    setHistory(updated)
    localStorage.setItem("unicode-scanner-history", JSON.stringify(updated))
  }

  const analyzeText = (text: string) => {
    if (!text) {
      setCharacters([])
      setDetectedInvisible([])
      setHighlightedText("")
      setCleanedText("")
      return
    }

    saveToHistory(text)

    // Detect invisible characters using the engine
    const { characters: invisible, cleanedText: cleaned } = detectInvisibleCharacters(text)
    setDetectedInvisible(invisible)
    setCleanedText(cleaned)
    setHighlightedText(generateHighlightedText(text, invisible))

    // Get all character details
    const analyzed: UnicodeInfo[] = []
    const seen = new Set<number>()

    for (const char of text) {
      const code = char.charCodeAt(0)
      if (!seen.has(code)) {
        seen.add(code)
        analyzed.push({
          char,
          code,
          hex: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
          name: getCharacterName(code),
          category: getCategory(code),
          block: getBlock(code),
        })
      }
    }

    setCharacters(analyzed)
    if (analyzed.length > 0) setSelectedChar(analyzed[0])
  }

  const getCharacterName = (code: number): string => {
    const names: Record<number, string> = {
      32: "SPACE",
      33: "EXCLAMATION MARK",
      34: "QUOTATION MARK",
      35: "NUMBER SIGN",
      36: "DOLLAR SIGN",
      37: "PERCENT SIGN",
      38: "AMPERSAND",
      39: "APOSTROPHE",
      40: "LEFT PARENTHESIS",
      41: "RIGHT PARENTHESIS",
      42: "ASTERISK",
      43: "PLUS SIGN",
      44: "COMMA",
      45: "HYPHEN-MINUS",
      46: "FULL STOP",
      47: "SOLIDUS",
      48: "DIGIT ZERO",
      49: "DIGIT ONE",
      50: "DIGIT TWO",
      51: "DIGIT THREE",
      52: "DIGIT FOUR",
      53: "DIGIT FIVE",
      54: "DIGIT SIX",
      55: "DIGIT SEVEN",
      56: "DIGIT EIGHT",
      57: "DIGIT NINE",
      58: "COLON",
      59: "SEMICOLON",
      60: "LESS-THAN SIGN",
      61: "EQUALS SIGN",
      62: "GREATER-THAN SIGN",
      63: "QUESTION MARK",
      64: "COMMERCIAL AT",
      65: "LATIN CAPITAL LETTER A",
      90: "LATIN CAPITAL LETTER Z",
      97: "LATIN SMALL LETTER A",
      122: "LATIN SMALL LETTER Z",
      127: "DELETE",
    }

    if (code in names) return names[code]

    if (code >= 65 && code <= 90) return `LATIN CAPITAL LETTER ${String.fromCharCode(code)}`
    if (code >= 97 && code <= 122) return `LATIN SMALL LETTER ${String.fromCharCode(code)}`
    if (code >= 48 && code <= 57) return `DIGIT ${code - 48}`

    return "UNKNOWN"
  }

  const getCategory = (code: number): string => {
    if (code >= 48 && code <= 57) return "Decimal Digit"
    if (code >= 65 && code <= 90) return "Uppercase Letter"
    if (code >= 97 && code <= 122) return "Lowercase Letter"
    if (code === 32) return "Whitespace"
    if (code < 32) return "Control"
    return "Punctuation"
  }

  const getBlock = (code: number): string => {
    if (code >= 0 && code <= 127) return "Basic Latin"
    if (code >= 128 && code <= 255) return "Latin-1 Supplement"
    if (code >= 256 && code <= 383) return "Latin Extended-A"
    if (code >= 384 && code <= 591) return "Latin Extended-B"
    return "Other"
  }

  const searchCharacters = (query: string) => {
    if (!query) return characters

    const lowerQuery = query.toLowerCase()
    return characters.filter(
      (c) =>
        c.char.toLowerCase().includes(lowerQuery) ||
        c.hex.toLowerCase().includes(lowerQuery) ||
        c.name.toLowerCase().includes(lowerQuery),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadResults = () => {
    const csv = [
      ["Character", "Unicode", "Hex", "Name", "Category", "Block"],
      ...characters.map((c) => [c.char, c.code, c.hex, c.name, c.category, c.block]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "unicode-analysis.csv"
    a.click()
  }

  const filtered = searchCharacters(searchQuery)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <PortfolioNavbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Unicode Scanner</h1>
          <p className="text-lg text-slate-300">
            Analyze text characters, get Unicode values, names, and detailed information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-200 mb-3">Enter Text to Analyze</label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  analyzeText(e.target.value)
                }}
                placeholder="Paste or type any text here..."
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none"
              />
            </div>

            {/* Highlighted Text with Markers */}
            {highlightedText && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                <label className="block text-sm font-semibold text-slate-200 mb-3">Text with Suspicious Character Markers (⦿)</label>
                <div className="w-full min-h-24 max-h-40 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm overflow-y-auto whitespace-pre-wrap break-words">
                  {highlightedText}
                </div>
                <p className="text-xs text-slate-400 mt-2">⦿ marks invisible or suspicious characters</p>
              </div>
            )}

            {/* Detected Suspicious Characters */}
            {detectedInvisible.length > 0 && (
              <div className="bg-red-500/10 backdrop-blur border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-red-400">⚠️ Suspicious Characters Detected</h2>
                    <p className="text-sm text-red-300/80 mt-1">{detectedInvisible.length} invisible/suspicious character(s) found</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {detectedInvisible.map((char, idx) => {
                    const isZeroWidth = char.codePoint === 0x200b
                    const isZeroWidthJoiner = char.codePoint === 0x200d
                    const isZeroWidthNonJoiner = char.codePoint === 0x200c
                    
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isZeroWidth || isZeroWidthJoiner || isZeroWidthNonJoiner
                            ? "bg-orange-500/20 border-orange-500/50"
                            : "bg-slate-700/30 border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white text-sm">{char.name}</span>
                          {(isZeroWidth || isZeroWidthJoiner || isZeroWidthNonJoiner) && (
                            <span className="text-xs bg-orange-500/50 text-orange-200 px-2 py-1 rounded">Zero-Width</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 space-y-0.5">
                          <div>Code Point: U+{char.codePoint.toString(16).toUpperCase().padStart(4, "0")}</div>
                          <div>Decimal: {char.codePoint}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold">ℹ️ Info:</span> These characters are invisible or have special formatting properties and can cause issues in code or text. Use "Cleaned Text" to remove them.
                  </p>
                </div>
              </div>
            )}

            {/* Cleaned Text Output */}
            {cleanedText && detectedInvisible.length > 0 && (
              <div className="bg-green-500/10 backdrop-blur border border-green-500/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-green-400 mb-3">✓ Cleaned Text (Suspicious Characters Removed)</label>
                <div className="w-full min-h-24 max-h-40 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm overflow-y-auto whitespace-pre-wrap break-words mb-3">
                  {cleanedText}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cleanedText)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors font-semibold"
                >
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy Cleaned Text"}
                </button>
              </div>
            )}

            {/* Search Results */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Characters Found: {filtered.length}</h2>
                {characters.length > 0 && (
                  <button
                    onClick={() => {
                      setInputText("")
                      setCharacters([])
                      setSelectedChar(null)
                      setSearchQuery("")
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                  >
                    <RotateCcw size={16} />
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by character, name, or hex..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                {filtered.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChar(char)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedChar?.code === char.code
                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                        : "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-2xl mb-1">{char.char}</div>
                    <div className="text-xs text-slate-400">{char.hex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {characters.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(characters.map((c) => c.char).join(""))}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                >
                  <Copy size={18} />
                  {copied ? "Copied!" : "Copy All Characters"}
                </button>
                <button
                  onClick={downloadResults}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg font-semibold transition-all"
                >
                  <Download size={18} />
                  Download CSV
                </button>
              </div>
            )}
          </div>

          {/* Character Details */}
          {selectedChar && (
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 sticky top-32">
                <h3 className="text-lg font-semibold text-white mb-6">Character Details</h3>

                <div className="flex items-center justify-center mb-8 p-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="text-6xl">{selectedChar.char}</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Unicode</label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg text-white font-mono">{selectedChar.code}</span>
                      <button
                        onClick={() => copyToClipboard(selectedChar.code.toString())}
                        className="p-2 hover:bg-slate-700/50 rounded transition-colors"
                      >
                        <Copy size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Hexadecimal</label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg text-white font-mono">{selectedChar.hex}</span>
                      <button
                        onClick={() => copyToClipboard(selectedChar.hex)}
                        className="p-2 hover:bg-slate-700/50 rounded transition-colors"
                      >
                        <Copy size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Name</label>
                    <p className="mt-2 text-slate-300 text-sm">{selectedChar.name}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                    <p className="mt-2 text-slate-300 text-sm">{selectedChar.category}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Block</label>
                    <p className="mt-2 text-slate-300 text-sm">{selectedChar.block}</p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(selectedChar.char)}
                  className="w-full mt-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded-lg transition-colors font-semibold"
                >
                  Copy Character
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {history.length > 0 && !inputText && (
          <div className="mt-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(item)
                    analyzeText(item)
                  }}
                  className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
                >
                  {item.length > 20 ? item.slice(0, 20) + "..." : item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
