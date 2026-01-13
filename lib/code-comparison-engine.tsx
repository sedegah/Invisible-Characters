// Code comparison engine
// Detects programming languages and compares code snippets

interface LanguageDetectionResult {
  language: string
  confidence: number
  details: {
    patternsMatched: string[]
    fileExtensions: string[]
    shebang?: string
    uniqueFeatures: string[]
    category: "compiled" | "interpreted" | "markup" | "data" | "scripting" | "functional"
    popularity: number
  }
}

const languagePatterns = {
  python: {
    regexes: [/\bdef\s+\w+\(/, /\bself\b/, /:\s*$/, /\bprint\s*\(/],
    extensions: [".py"],
    category: "interpreted" as const,
    popularity: 95,
    uniqueFeatures: ["Colon-based blocks", "Indentation-sensitive", "Dynamic typing"],
  },
  javascript: {
    regexes: [/\b=>\b/, /\bconsole\.log\b/, /\bexport\s+(default|const|function)/],
    extensions: [".js", ".jsx"],
    category: "interpreted" as const,
    popularity: 98,
    uniqueFeatures: ["Arrow functions", "Prototype-based OOP", "Event-driven"],
  },
  typescript: {
    regexes: [/:\s*(string|number|boolean|any|unknown|void|interface|type)/],
    extensions: [".ts", ".tsx"],
    category: "interpreted" as const,
    popularity: 92,
    uniqueFeatures: ["Static typing", "Interfaces", "Type annotations"],
  },
  cpp: {
    regexes: [/#include\s*</, /\bstd::\b/, /\bcout\s*<</],
    extensions: [".cpp", ".hpp"],
    category: "compiled" as const,
    popularity: 93,
    uniqueFeatures: ["Header includes", "Namespace std", "Operator overloading"],
  },
  c: {
    regexes: [/#include\s*</, /\bprintf\s*\(/, /\bint\s+main\s*\(/],
    extensions: [".c"],
    category: "compiled" as const,
    popularity: 90,
    uniqueFeatures: ["C stdio", "Manual memory", "Procedural design"],
  },
  java: {
    regexes: [/\bpublic\s+class\b/, /\bSystem\.out\.println\b/, /\bstatic\s+void\s+main\b/],
    extensions: [".java"],
    category: "compiled" as const,
    popularity: 96,
    uniqueFeatures: ["Class-based OOP", "JVM runtime", "Static typing"],
  },
  rust: {
    regexes: [/\bfn\s+\w+\s*$$/, /\bmut\b/, /\b->\s*\w+/, /\bunwrap\($$/],
    extensions: [".rs"],
    category: "compiled" as const,
    popularity: 88,
    uniqueFeatures: ["Memory safety", "Ownership system", "Zero-cost abstractions"],
  },
  go: {
    regexes: [/\bfunc\s+\w+\(/, /\berr\s*!=\s*nil\b/, /\bpackage\s+\w+/],
    extensions: [".go"],
    category: "compiled" as const,
    popularity: 85,
    uniqueFeatures: ["Goroutines", "Interfaces", "Built-in concurrency"],
  },
  html: {
    regexes: [/<\/?[a-z][\s\S]*?>/i, /<!DOCTYPE\s+html>/i],
    extensions: [".html", ".htm"],
    category: "markup" as const,
    popularity: 99,
    uniqueFeatures: ["Tag-based structure", "Semantic elements"],
  },
  css: {
    regexes: [/\b(color|background|font-size|display|position|margin|padding|@media)\b/],
    extensions: [".css"],
    category: "markup" as const,
    popularity: 95,
    uniqueFeatures: ["Cascade and inheritance", "Selectors specificity"],
  },
  json: {
    regexes: [/^\s*\{[\s\S]*\}\s*$/, /"[\w-]+":/],
    extensions: [".json"],
    category: "data" as const,
    popularity: 97,
    uniqueFeatures: ["Key-value pairs", "No comments", "Strict structure"],
  },
}

export const detectLanguage = (code: string): LanguageDetectionResult => {
  if (!code) {
    return {
      language: "unknown",
      confidence: 0,
      details: {
        patternsMatched: [],
        fileExtensions: [],
        uniqueFeatures: [],
        category: "scripting",
        popularity: 0,
      },
    }
  }

  const shebangMatch = code.match(/^#!\s*(?:\/usr\/bin\/env\s+)?(\w+)/)
  const shebangLang = shebangMatch?.[1]

  let bestMatch: LanguageDetectionResult = {
    language: "unknown",
    confidence: 0,
    details: {
      patternsMatched: [],
      fileExtensions: [],
      uniqueFeatures: [],
      category: "scripting",
      popularity: 0,
    },
  }

  for (const [lang, config] of Object.entries(languagePatterns)) {
    let score = 0
    const matched: string[] = []

    for (const regex of config.regexes) {
      if (regex.test(code)) {
        score++
        matched.push(regex.source)
      }
    }

    if (shebangLang && lang.toLowerCase().includes(shebangLang.toLowerCase())) score += 2

    const confidence = Math.min(score / config.regexes.length, 1)
    if (confidence > bestMatch.confidence) {
      bestMatch = {
        language: lang,
        confidence,
        details: {
          patternsMatched: matched,
          fileExtensions: config.extensions,
          shebang: shebangLang,
          uniqueFeatures: config.uniqueFeatures,
          category: config.category,
          popularity: config.popularity,
        },
      }
    }
  }

  return bestMatch.confidence < 0.3
    ? {
        language: "unknown",
        confidence: 0,
        details: {
          patternsMatched: [],
          fileExtensions: [],
          uniqueFeatures: [],
          category: "scripting",
          popularity: 0,
        },
      }
    : bestMatch
}

export const compareCode = (code1: string, code2: string) => {
  const lines1 = code1.split("\n")
  const lines2 = code2.split("\n")
  const diffs: Array<{ lineNum: number; type: "added" | "removed" | "modified"; line1: string; line2: string }> = []

  const max = Math.max(lines1.length, lines2.length)
  for (let i = 0; i < max; i++) {
    const a = lines1[i] || ""
    const b = lines2[i] || ""

    if (a !== b) {
      if (i >= lines1.length) {
        diffs.push({ lineNum: i + 1, type: "added", line1: "", line2: b })
      } else if (i >= lines2.length) {
        diffs.push({ lineNum: i + 1, type: "removed", line1: a, line2: "" })
      } else {
        diffs.push({ lineNum: i + 1, type: "modified", line1: a, line2: b })
      }
    }
  }

  return diffs
}

export type { LanguageDetectionResult }
