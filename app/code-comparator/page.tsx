"use client"

import { useState, useEffect } from "react"
import { Copy, Download, RotateCcw, ChevronDown } from "lucide-react"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"

interface DiffLine {
  type: "add" | "remove" | "unchanged"
  content: string
  lineNumber?: number
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
]

export default function CodeComparatorPage() {
  const [originalCode, setOriginalCode] = useState("")
  const [modifiedCode, setModifiedCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [diff, setDiff] = useState<DiffLine[]>([])
  const [showDiff, setShowDiff] = useState(false)
  const [history, setHistory] = useState<{ original: string; modified: string; lang: string }[]>([])
  const [copied, setCopied] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("code-comparator-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const saveToHistory = () => {
    if (!originalCode || !modifiedCode) return
    const updated = [{ original: originalCode, modified: modifiedCode, lang: language }, ...history].slice(0, 5)
    setHistory(updated)
    localStorage.setItem("code-comparator-history", JSON.stringify(updated))
  }

  const computeDiff = () => {
    if (!originalCode || !modifiedCode) return

    saveToHistory()

    const original = originalCode.split("\n")
    const modified = modifiedCode.split("\n")
    const diffResult: DiffLine[] = []

    const maxLen = Math.max(original.length, modified.length)

    for (let i = 0; i < maxLen; i++) {
      const origLine = original[i] || ""
      const modLine = modified[i] || ""

      if (origLine === modLine) {
        if (origLine) {
          diffResult.push({ type: "unchanged", content: origLine, lineNumber: i + 1 })
        }
      } else {
        if (origLine) {
          diffResult.push({ type: "remove", content: origLine, lineNumber: i + 1 })
        }
        if (modLine) {
          diffResult.push({ type: "add", content: modLine, lineNumber: i + 1 })
        }
      }
    }

    setDiff(diffResult)
    setShowDiff(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadDiff = () => {
    let content = `Language: ${language}\n`
    content += `Generated: ${new Date().toLocaleString()}\n\n`
    content += "ORIGINAL CODE:\n"
    content += "=".repeat(50) + "\n"
    content += originalCode + "\n\n"
    content += "MODIFIED CODE:\n"
    content += "=".repeat(50) + "\n"
    content += modifiedCode + "\n\n"
    content += "DIFF:\n"
    content += "=".repeat(50) + "\n"
    content += diff
      .map((line) => {
        const prefix = line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  "
        return prefix + line.content
      })
      .join("\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-diff-${Date.now()}.txt`
    a.click()
  }

  const stats = {
    added: diff.filter((d) => d.type === "add").length,
    removed: diff.filter((d) => d.type === "remove").length,
    unchanged: diff.filter((d) => d.type === "unchanged").length,
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500/20 text-yellow-300",
      typescript: "bg-blue-500/20 text-blue-300",
      python: "bg-blue-600/20 text-blue-300",
      java: "bg-orange-500/20 text-orange-300",
      cpp: "bg-blue-700/20 text-blue-300",
      csharp: "bg-purple-500/20 text-purple-300",
      php: "bg-indigo-500/20 text-indigo-300",
      ruby: "bg-red-500/20 text-red-300",
      go: "bg-cyan-500/20 text-cyan-300",
      rust: "bg-orange-600/20 text-orange-300",
      sql: "bg-green-500/20 text-green-300",
      html: "bg-orange-400/20 text-orange-300",
      css: "bg-blue-500/20 text-blue-300",
      json: "bg-amber-500/20 text-amber-300",
      bash: "bg-gray-500/20 text-gray-300",
    }
    return colors[lang] || "bg-slate-500/20 text-slate-300"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <PortfolioNavbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Code Comparator</h1>
          <p className="text-lg text-slate-300">Compare two code snippets and visualize the differences side-by-side</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Code */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">Original Code</label>
            <textarea
              value={originalCode}
              onChange={(e) => setOriginalCode(e.target.value)}
              placeholder="Paste your original code here..."
              className="w-full h-80 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none"
            />
          </div>

          {/* Modified Code */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">Modified Code</label>
            <textarea
              value={modifiedCode}
              onChange={(e) => setModifiedCode(e.target.value)}
              placeholder="Paste your modified code here..."
              className="w-full h-80 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-none"
            />
          </div>
        </div>

        {/* Language Selection and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-200 mb-2">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="flex gap-3 sm:pt-7">
            <button
              onClick={computeDiff}
              className="flex-1 sm:flex-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
            >
              Compare
            </button>
            <button
              onClick={() => {
                setOriginalCode("")
                setModifiedCode("")
                setDiff([])
                setShowDiff(false)
              }}
              className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Diff Results */}
        {showDiff && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{stats.removed}</div>
                <div className="text-sm text-red-300">Removed</div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{stats.added}</div>
                <div className="text-sm text-green-300">Added</div>
              </div>
              <div className="bg-slate-500/20 border border-slate-500/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-slate-400">{stats.unchanged}</div>
                <div className="text-sm text-slate-300">Unchanged</div>
              </div>
            </div>

            {/* Language Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLanguageColor(language)}`}>
                  {LANGUAGES.find((l) => l.value === language)?.label}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(diff.map((d) => d.content).join("\n"))}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all"
                >
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={downloadDiff}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            {/* Diff View */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto font-mono text-sm">
                {diff.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No differences found</div>
                ) : (
                  diff.map((line, idx) => (
                    <div
                      key={idx}
                      className={`flex border-b border-slate-700/30 last:border-b-0 ${
                        line.type === "add"
                          ? "bg-green-500/10"
                          : line.type === "remove"
                            ? "bg-red-500/10"
                            : "bg-slate-700/20"
                      }`}
                    >
                      <div className="w-12 px-3 py-2 bg-slate-900/30 text-slate-500 flex-shrink-0 text-right select-none">
                        {line.lineNumber}
                      </div>
                      <div className="flex-1 px-4 py-2 text-slate-300">
                        <span
                          className={`inline-block w-6 mr-2 text-center font-bold ${
                            line.type === "add"
                              ? "text-green-400"
                              : line.type === "remove"
                                ? "text-red-400"
                                : "text-slate-500"
                          }`}
                        >
                          {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                        </span>
                        <span className="break-all">{line.content}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Comparisons</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setOriginalCode(item.original)
                    setModifiedCode(item.modified)
                    setLanguage(item.lang)
                    computeDiff()
                  }}
                  className="w-full p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300 truncate">
                        {item.original.split("\n")[0].slice(0, 50)}...
                      </div>
                    </div>
                    <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${getLanguageColor(item.lang)}`}>
                      {LANGUAGES.find((l) => l.value === item.lang)?.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
