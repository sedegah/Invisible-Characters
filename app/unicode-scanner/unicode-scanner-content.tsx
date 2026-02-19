"use client";

import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Download,
  Search,
  RotateCcw,
  Upload,
  FileText,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import {
  detectInvisibleCharacters,
  getCharacterDetails,
  generateHighlightedText,
  type DetectedChar,
} from "@/lib/unicode-engine";
import {
  parseDocxFile,
  createCleanedDocx,
  isValidDocxFile,
  formatFileSize,
  type DocxAnalysisResult,
} from "@/lib/docx-processor";

interface UnicodeInfo {
  char: string;
  code: number;
  hex: string;
  name: string;
  category: string;
  block: string;
}

export default function UnicodeScannerContent() {
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [characters, setCharacters] = useState<UnicodeInfo[]>([]);
  const [selectedChar, setSelectedChar] = useState<UnicodeInfo | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [detectedInvisible, setDetectedInvisible] = useState<DetectedChar[]>(
    [],
  );
  const [highlightedText, setHighlightedText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [docxAnalysis, setDocxAnalysis] = useState<DocxAnalysisResult | null>(
    null,
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("unicode-scanner-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  const saveToHistory = (text: string) => {
    const updated = [text, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("unicode-scanner-history", JSON.stringify(updated));
  };

  const analyzeText = (text: string) => {
    if (!text) {
      setCharacters([]);
      setDetectedInvisible([]);
      setHighlightedText("");
      setCleanedText("");
      return;
    }

    saveToHistory(text);

    // Detect invisible characters using the engine
    const { characters: invisible, cleanedText: cleaned } =
      detectInvisibleCharacters(text);
    setDetectedInvisible(invisible);
    setCleanedText(cleaned);
    setHighlightedText(generateHighlightedText(text, invisible));

    // Get all character details
    const analyzed: UnicodeInfo[] = [];
    const seen = new Set<number>();

    for (const char of text) {
      const code = char.charCodeAt(0);
      if (!seen.has(code)) {
        seen.add(code);
        analyzed.push({
          char,
          code,
          hex: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
          name: getCharacterName(code),
          category: getCategory(code),
          block: getBlock(code),
        });
      }
    }

    setCharacters(analyzed);
    if (analyzed.length > 0) setSelectedChar(analyzed[0]);
  };

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
    };

    if (code in names) return names[code];

    if (code >= 65 && code <= 90)
      return `LATIN CAPITAL LETTER ${String.fromCharCode(code)}`;
    if (code >= 97 && code <= 122)
      return `LATIN SMALL LETTER ${String.fromCharCode(code)}`;
    if (code >= 48 && code <= 57) return `DIGIT ${code - 48}`;

    return "UNKNOWN";
  };

  const getCategory = (code: number): string => {
    if (code >= 48 && code <= 57) return "Decimal Digit";
    if (code >= 65 && code <= 90) return "Uppercase Letter";
    if (code >= 97 && code <= 122) return "Lowercase Letter";
    if (code === 32) return "Whitespace";
    if (code < 32) return "Control";
    return "Punctuation";
  };

  const getBlock = (code: number): string => {
    if (code >= 0 && code <= 127) return "Basic Latin";
    if (code >= 128 && code <= 255) return "Latin-1 Supplement";
    if (code >= 256 && code <= 383) return "Latin Extended-A";
    if (code >= 384 && code <= 591) return "Latin Extended-B";
    return "Other";
  };

  const searchCharacters = (query: string) => {
    if (!query) return characters;

    const lowerQuery = query.toLowerCase();
    return characters.filter(
      (c) =>
        c.char.toLowerCase().includes(lowerQuery) ||
        c.hex.toLowerCase().includes(lowerQuery) ||
        c.name.toLowerCase().includes(lowerQuery),
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResults = () => {
    const csv = [
      ["Character", "Unicode", "Hex", "Name", "Category", "Block"],
      ...characters.map((c) => [
        c.char,
        c.code,
        c.hex,
        c.name,
        c.category,
        c.block,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unicode-analysis.csv";
    a.click();
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Validate file type
    if (!isValidDocxFile(file)) {
      setFileError("Please upload a valid .docx file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setIsProcessingFile(true);

    try {
      const analysis = await parseDocxFile(file);
      setDocxAnalysis(analysis);
      setInputText(analysis.originalText);
      analyzeText(analysis.originalText);
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : "Failed to process file",
      );
      setUploadedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Clear file upload
  const clearFileUpload = () => {
    setUploadedFile(null);
    setDocxAnalysis(null);
    setFileError(null);
    setInputText("");
    setCharacters([]);
    setSelectedChar(null);
    setDetectedInvisible([]);
    setHighlightedText("");
    setCleanedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Download cleaned DOCX
  const downloadCleanedDocx = async () => {
    if (!uploadedFile || !docxAnalysis) return;

    try {
      const blob = await createCleanedDocx(
        uploadedFile,
        docxAnalysis.cleanedText,
        docxAnalysis.fileName,
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = docxAnalysis.fileName.replace(".docx", "_cleaned.docx");
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading cleaned document:", error);
      setFileError("Failed to create cleaned document");
    }
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split("⦿");

    return (
      <>
        {parts.map((part, idx) => (
          <span key={`${part}-${idx}`}>
            {part}
            {idx < parts.length - 1 && (
              <span className="inline-flex items-center justify-center rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white align-middle shadow-sm">
                ⦿
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  const filtered = searchCharacters(searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNavbar />

      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unicode Scanner
          </h1>
          <p className="text-lg text-foreground/70">
            Analyze text characters, get Unicode values, names, and detailed
            information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Enter Text to Analyze
              </label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputText(value);
                  analyzeText(value);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData("text");
                  setInputText(pastedText);
                  analyzeText(pastedText);
                }}
                placeholder="Paste or type any text here..."
                className="w-full h-32 bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
                disabled={isProcessingFile}
              />
            </div>

            {/* Highlighted Text with Markers */}
            {highlightedText && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-black/30">
                <div className="mb-3 flex items-center gap-2 text-slate-100">
                  <Eye size={18} className="text-slate-300" />
                  <label className="text-2xl font-bold">
                    Invisible Characters Revealed:
                  </label>
                </div>
                <div className="w-full min-h-24 max-h-96 overflow-y-auto rounded-xl border border-slate-800 bg-black/60 px-4 py-3 font-mono text-lg leading-8 text-slate-100 whitespace-pre-wrap break-words">
                  {renderHighlightedText(highlightedText)}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Blue ⦿ markers show suspicious/invisible characters only.
                </p>
              </div>
            )}

            {/* Detected Suspicious Characters */}
            {detectedInvisible.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-destructive">
                      ⚠️ Suspicious Characters Detected
                    </h2>
                    <p className="text-sm text-destructive/80 mt-1">
                      {detectedInvisible.length} invisible/suspicious
                      character(s) found
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {detectedInvisible.map((char, idx) => {
                    const isZeroWidth = char.codePoint === 0x200b;
                    const isZeroWidthJoiner = char.codePoint === 0x200d;
                    const isZeroWidthNonJoiner = char.codePoint === 0x200c;

                    // Check if this character exists in docxAnalysis
                    const docxChar = docxAnalysis?.detectedCharacters.find(
                      (c) => c.codePoint === char.codePoint,
                    );

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isZeroWidth ||
                          isZeroWidthJoiner ||
                          isZeroWidthNonJoiner
                            ? "bg-blue-500/20 border-blue-500/50"
                            : "bg-muted border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-foreground text-sm">
                            {char.name}
                          </span>
                          {(isZeroWidth ||
                            isZeroWidthJoiner ||
                            isZeroWidthNonJoiner) && (
                            <span className="text-xs bg-blue-500/50 text-blue-100 px-2 py-1 rounded">
                              Zero-Width
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-foreground/60 space-y-0.5">
                          <div>
                            Code Point: U+
                            {char.codePoint
                              .toString(16)
                              .toUpperCase()
                              .padStart(4, "0")}
                          </div>
                          <div>Decimal: {char.codePoint}</div>
                          {docxChar && (
                            <div className="text-primary font-semibold mt-1">
                              Occurrences: {docxChar.count}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold">ℹ️ Info:</span> These
                    characters are invisible or have special formatting
                    properties and can cause issues in code or text. Use
                    "Cleaned Text" to remove them.
                  </p>
                </div>
              </div>
            )}

            {/* Cleaned Text Output */}
            {cleanedText && detectedInvisible.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <label className="block text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
                  ✓ Cleaned Text (Suspicious Characters Removed)
                </label>
                <div className="w-full min-h-24 max-h-40 bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm overflow-y-auto whitespace-pre-wrap break-words mb-3">
                  {cleanedText}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cleanedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-600 dark:text-green-400 rounded-lg transition-colors font-semibold"
                >
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy Cleaned Text"}
                </button>
              </div>
            )}

            {/* Search Results */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Characters Found: {filtered.length}
                </h2>
                {characters.length > 0 && (
                  <button
                    onClick={() => {
                      setInputText("");
                      setCharacters([]);
                      setSelectedChar(null);
                      setSearchQuery("");
                      setDetectedInvisible([]);
                      setHighlightedText("");
                      setCleanedText("");
                      setCopied(false);
                      clearFileUpload();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border"
                  >
                    <RotateCcw size={16} />
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by character, name, or hex..."
                    className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50"
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
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-muted border-border text-foreground/70 hover:bg-muted/80 hover:border-border"
                    }`}
                  >
                    <div className="text-2xl mb-1">{char.char}</div>
                    <div className="text-xs text-foreground/50">{char.hex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {characters.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    copyToClipboard(characters.map((c) => c.char).join(""))
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                >
                  <Copy size={18} />
                  {copied ? "Copied!" : "Copy All Characters"}
                </button>
                <button
                  onClick={downloadResults}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold transition-all border border-border"
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
              <div className="bg-card border border-border rounded-xl p-6 sticky top-32">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Character Details
                </h3>

                <div className="flex items-center justify-center mb-8 p-6 bg-muted rounded-lg border border-border">
                  <div className="text-6xl text-foreground">
                    {selectedChar.char}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase">
                      Unicode
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg text-foreground font-mono">
                        {selectedChar.code}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedChar.code.toString())
                        }
                        className="p-2 hover:bg-muted rounded transition-colors"
                      >
                        <Copy size={16} className="text-foreground/60" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase">
                      Hexadecimal
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg text-foreground font-mono">
                        {selectedChar.hex}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedChar.hex)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                      >
                        <Copy size={16} className="text-foreground/60" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase">
                      Name
                    </label>
                    <p className="mt-2 text-foreground/80 text-sm">
                      {selectedChar.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase">
                      Category
                    </label>
                    <p className="mt-2 text-foreground/80 text-sm">
                      {selectedChar.category}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/60 uppercase">
                      Block
                    </label>
                    <p className="mt-2 text-foreground/80 text-sm">
                      {selectedChar.block}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(selectedChar.char)}
                  className="w-full mt-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors font-semibold"
                >
                  Copy Character
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {history.length > 0 && !inputText && (
          <div className="mt-12 bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(item);
                    analyzeText(item);
                  }}
                  className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm border border-border"
                >
                  {item.length > 20 ? item.slice(0, 20) + "..." : item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Document Upload Section */}
        <div className="mt-12 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={24} className="text-foreground" />
            <h2 className="text-2xl font-semibold text-foreground">
              Upload & Analyze Documents
            </h2>
          </div>
          <p className="text-foreground/70 mb-6">
            Upload a .docx file to automatically scan for invisible and
            suspicious characters while preserving document structure.
          </p>

          {/* Upload Area */}
          <div
            className="mb-6 p-8 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <Upload size={40} className="text-primary mb-3" />
              <p className="text-lg font-semibold text-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-foreground/60">
                DOCX files up to 10MB
              </p>
            </div>
          </div>

          {/* Processing State */}
          {isProcessingFile && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4">
              <p className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
                Processing document...
              </p>
            </div>
          )}

          {/* Error State */}
          {fileError && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-destructive mt-0.5 flex-shrink-0"
              />
              <p className="text-destructive text-sm">{fileError}</p>
            </div>
          )}

          {/* File Uploaded State */}
          {uploadedFile && !isProcessingFile && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                  <div>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFileUpload}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Download Cleaned Document Button */}
          {docxAnalysis && uploadedFile && !isProcessingFile && (
            <div className="space-y-3">
              <button
                onClick={downloadCleanedDocx}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-600 dark:text-green-400 rounded-lg transition-colors font-semibold border border-green-500/30"
              >
                <Download size={18} />
                Download Cleaned Document
              </button>

              {/* Disclaimer */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>⚠️ Note:</strong> Full document preservation is
                    still under development. The cleaned document will have
                    invisible and suspicious characters removed, but complete
                    formatting preservation is not yet available.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
