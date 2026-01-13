"use client"

import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import { Shield, GitCompare, Copy, Download, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <>
      <PortfolioNavbar />
      
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="pt-32 pb-16 px-4 sm:px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Documentation</h1>
            <p className="text-lg text-foreground/70">
              Complete guide to Invisible Characters tools developed by <span className="font-semibold text-primary">Kimathi Sedegah</span>
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-20 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* About Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">About Invisible Characters</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Invisible Characters is an open-source suite of developer tools created by <span className="font-semibold">Kimathi Sedegah</span> to help developers write more secure and maintainable code. The platform provides powerful utilities for code analysis, text inspection, and security threat detection—all completely free.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Whether you're building applications, analyzing code, or hunting for vulnerabilities, Invisible Characters provides the tools you need to work with confidence.
              </p>
            </div>

            {/* Unicode Scanner Section */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Unicode Scanner</h3>
                  <p className="text-foreground/70">Detect and analyze hidden Unicode characters</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">What it does</h4>
                <p className="text-foreground/80">
                  Unicode Scanner analyzes text and code to identify suspicious, hidden, or potentially dangerous Unicode characters. It detects:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Zero-width characters</span> (invisible but present in code)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Control characters</span> that could hide malicious code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Formatting marks</span> that might cause issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Obfuscated characters</span> used in security attacks</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">How to use</h4>
                <ol className="space-y-3 list-decimal list-inside text-foreground/80">
                  <li>Visit the <Link href="/unicode-scanner" className="text-primary hover:underline">Unicode Scanner</Link></li>
                  <li>Paste or type your text into the input field</li>
                  <li>The scanner automatically analyzes your text</li>
                  <li>Review detected suspicious characters with their Unicode values</li>
                  <li>Use the "Cleaned Text" output to remove invisible characters</li>
                  <li>Export results as CSV for further analysis</li>
                </ol>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Use Case Example</p>
                    <p className="text-sm text-foreground/70">Protect your codebase from invisible character attacks where malicious actors hide code using zero-width characters. Security auditors use Unicode Scanner to identify potential injection vectors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Comparator Section */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <GitCompare className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Code Comparator</h3>
                  <p className="text-foreground/70">Compare and analyze code across 50+ languages</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">What it does</h4>
                <p className="text-foreground/80">
                  Code Comparator is an intelligent tool that helps you:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Compare code snippets</span> side-by-side with detailed diff analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Auto-detect languages</span> from 50+ supported programming languages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Generate diffs</span> for version control and code review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80"><span className="font-semibold">Export results</span> for documentation and collaboration</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Supported Languages</h4>
                <p className="text-foreground/80 mb-3">Code Comparator supports comparison across multiple programming languages including:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"].map((lang) => (
                    <div key={lang} className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground/80">{lang}</div>
                  ))}
                </div>
                <p className="text-sm text-foreground/60 mt-3">And many more! Language detection is automatic.</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">How to use</h4>
                <ol className="space-y-3 list-decimal list-inside text-foreground/80">
                  <li>Visit the <Link href="/code-comparator" className="text-primary hover:underline">Code Comparator</Link></li>
                  <li>Paste your original code in the left panel</li>
                  <li>Paste the modified code in the right panel</li>
                  <li>Languages are automatically detected with confidence scores</li>
                  <li>Click "Compare" to generate the diff</li>
                  <li>Review additions, removals, and changes</li>
                  <li>Download or copy the diff for your records</li>
                </ol>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Use Case Example</p>
                    <p className="text-sm text-foreground/70">Code reviewers use Code Comparator to quickly understand changes between versions, identify refactoring improvements, and ensure code quality standards are maintained across different programming languages.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Key Features</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Copy, title: "Copy & Export", desc: "Copy results or export as CSV/TXT" },
                  { icon: Download, title: "Download", desc: "Save analysis results locally" },
                  { icon: Shield, title: "100% Free", desc: "No sign-up, no hidden costs" },
                  { icon: GitCompare, title: "Open Source", desc: "Community-driven development" },
                ].map((feature) => (
                  <div key={feature.title} className="bg-card border border-border rounded-lg p-4">
                    <feature.icon className="w-6 h-6 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-foreground/70">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About Author */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About the Developer</h2>
              <p className="text-foreground/80">
                <span className="font-semibold">Kimathi Sedegah</span> is a full-stack developer passionate about building tools that make developers' lives easier. With a focus on security, performance, and user experience, Kimathi created Invisible Characters to address real pain points in code analysis and security threat detection.
              </p>
              <p className="text-foreground/80">
                When not coding, you can find Kimathi exploring new technologies, contributing to open-source projects, or working on the next iteration of developer tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://github.com/sedegah"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                  View on GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/kimathi-sedegah/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors border border-border"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    q: "Is Invisible Characters really free?",
                    a: "Yes! Both Unicode Scanner and Code Comparator are completely free and open-source. No sign-up, no credit card, no hidden costs.",
                  },
                  {
                    q: "Do you store my data?",
                    a: "No. All analysis happens locally in your browser. We don't store, log, or transmit any of the text or code you analyze.",
                  },
                  {
                    q: "Can I use these tools offline?",
                    a: "The tools are web-based and require an internet connection, but your data processing happens on your device for privacy.",
                  },
                  {
                    q: "How accurate is the Unicode detection?",
                    a: "Unicode Scanner detects 63+ types of invisible and suspicious characters with 99% accuracy. It includes zero-width characters, control characters, and formatting marks.",
                  },
                  {
                    q: "What languages does Code Comparator support?",
                    a: "Code Comparator supports 50+ programming languages with automatic detection. See the documentation above for the full list.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                    <p className="text-foreground/80 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 sm:p-12 text-center space-y-4">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Try Invisible Characters tools right now. No sign-up required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/unicode-scanner"
                  className="inline-block bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
                >
                  Try Unicode Scanner
                </Link>
                <Link
                  href="/code-comparator"
                  className="inline-block bg-primary-foreground/20 border border-primary-foreground/50 text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors"
                >
                  Try Code Comparator
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
