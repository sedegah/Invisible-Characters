"use client"

import { useState, useEffect } from "react"
import { Copy, Download, RotateCcw, ChevronDown } from "lucide-react"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { detectLanguageLLM, compareCode, type LanguageDetectionResult } from "@/lib/code-comparison-engine"

interface DiffLine {
  type: "add" | "remove" | "unchanged"
  content: string
  lineNumber?: number
}

export default function CodeComparatorPage() {
  const [originalCode, setOriginalCode] = useState("")
  const [modifiedCode, setModifiedCode] = useState("")
  const [diff, setDiff] = useState<string[]>([])
  const [showDiff, setShowDiff] = useState(false)
  const [history, setHistory] = useState<{ original: string; modified: string }[]>([])
  const [copied, setCopied] = useState(false)
  const [result1, setResult1] = useState<LanguageDetectionResult | null>(null)
  const [result2, setResult2] = useState<LanguageDetectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("code-comparator-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // Auto-detect languages on code change
  useEffect(() => {
    const analyze = async () => {
      if (originalCode.trim() || modifiedCode.trim()) {
        setIsAnalyzing(true)
        try {
          if (originalCode.trim()) setResult1(await detectLanguageLLM(originalCode))
          else setResult1(null)

          if (modifiedCode.trim()) setResult2(await detectLanguageLLM(modifiedCode))
          else setResult2(null)
        } finally {
          setIsAnalyzing(false)
        }
      } else {
        setResult1(null)
        setResult2(null)
      }
    }

    const timeoutId = setTimeout(analyze, 500)
    return () => clearTimeout(timeoutId)
  }, [originalCode, modifiedCode])

  const saveToHistory = () => {
    if (!originalCode || !modifiedCode) return
    const updated = [{ original: originalCode, modified: modifiedCode }, ...history].slice(0, 5)
    setHistory(updated)
    localStorage.setItem("code-comparator-history", JSON.stringify(updated))
  }

  const computeDiff = () => {
    if (!originalCode || !modifiedCode) return

    saveToHistory()

    const diffs = compareCode(originalCode, modifiedCode)
    setDiff(diffs)
    setShowDiff(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadDiff = () => {
    let content = `Generated: ${new Date().toLocaleString()}\n\n`
    content += "ORIGINAL CODE:\n"
    content += "=".repeat(50) + "\n"
    content += originalCode + "\n\n"
    content += "MODIFIED CODE:\n"
    content += "=".repeat(50) + "\n"
    content += modifiedCode + "\n\n"
    content += "DIFF:\n"
    content += "=".repeat(50) + "\n"
    content += diff.join("\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-diff-${Date.now()}.txt`
    a.click()
  }

  const stats = {
    differences: diff.length,
  }

  const getLanguageLabel = (lang: string) => {
    const langMap: Record<string, string> = {
      python: "Python",
      javascript: "JavaScript",
      cpp: "C++",
      c: "C",
      java: "Java",
      html: "HTML",
      css: "CSS",
      json: "JSON",
    }
    return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      python: "bg-blue-600/20 text-blue-300",
      javascript: "bg-yellow-500/20 text-yellow-300",
      cpp: "bg-blue-700/20 text-blue-300",
      c: "bg-gray-600/20 text-gray-300",
      java: "bg-orange-500/20 text-orange-300",
      html: "bg-orange-400/20 text-orange-300",
      css: "bg-blue-500/20 text-blue-300",
      json: "bg-amber-500/20 text-amber-300",
    }
    return colors[lang] || "bg-slate-500/20 text-slate-300"
  }

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNavbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Code Comparator</h1>
          <p className="text-lg text-foreground/70">Compare two code snippets and visualize the differences side-by-side</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Code */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Original Code</label>
            <textarea
              value={originalCode}
              onChange={(e) => setOriginalCode(e.target.value)}
              placeholder="Paste your original code here..."
              className="w-full h-80 bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Modified Code */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Modified Code</label>
            <textarea
              value={modifiedCode}
              onChange={(e) => setModifiedCode(e.target.value)}
              placeholder="Paste your modified code here..."
              className="w-full h-80 bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        {/* Language Detection and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-semibold text-foreground">Detected Languages</label>
            <div className="flex gap-3 flex-wrap">
              {result1 && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getLanguageColor(result1.language)}`}>
                  {result1.language !== "unknown" 
                    ? `${getLanguageLabel(result1.language)} (${Math.round(result1.confidence * 100)}%)`
                    : "Original: Unknown"}
                </div>
              )}
              {result2 && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getLanguageColor(result2.language)}`}>
                  {result2.language !== "unknown"
                    ? `${getLanguageLabel(result2.language)} (${Math.round(result2.confidence * 100)}%)`
                    : "Modified: Unknown"}
                </div>
              )}
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
              className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all border border-border"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Diff Results */}
        {showDiff && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.differences}</div>
                  <div className="text-sm text-foreground/60">Differences Found</div>
                </div>
                {diff.length === 0 && (
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">Perfect Match!</div>
                    <div className="text-sm text-green-600/80 dark:text-green-300">No differences detected</div>
                  </div>
                )}
              </div>
            </div>

            {/* Language Badges */}
            {(result1 || result2) && (
              <div className="flex items-center gap-3 flex-wrap">
                {result1 && result1.language !== "unknown" && (
                  <div className="text-xs">
                    <span className="text-foreground/60">Original: </span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${getLanguageColor(result1.language)}`}>
                      {getLanguageLabel(result1.language)}
                    </span>
                  </div>
                )}
                {result2 && result2.language !== "unknown" && (
                  <div className="text-xs">
                    <span className="text-foreground/60">Modified: </span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${getLanguageColor(result2.language)}`}>
                      {getLanguageLabel(result2.language)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(diff.join("\n"))}
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all border border-border"
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadDiff}
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all border border-border"
              >
                <Download size={16} />
                Download
              </button>
            </div>

            {/* Diff View */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto font-mono text-sm">
                {diff.length === 0 ? (
                  <div className="p-6 text-center text-foreground/60">No differences found</div>
                ) : (
                  diff.map((diffLine, idx) => (
                    <div key={idx} className="p-3 border-b border-border last:border-b-0 text-foreground/80">
                      <div className="break-all">{diffLine}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12 bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Comparisons</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setOriginalCode(item.original)
                    setModifiedCode(item.modified)
                    setShowDiff(false)
                  }}
                  className="w-full p-3 bg-muted hover:bg-muted/80 rounded-lg border border-border hover:border-border transition-all text-left"
                >
                  <div className="text-sm text-foreground/70 truncate">
                    {item.original.split("\n")[0].slice(0, 50)}...
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
