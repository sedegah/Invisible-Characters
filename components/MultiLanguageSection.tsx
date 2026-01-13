"use client"

import { motion } from "framer-motion"

const languages = [
  { name: "Python", emoji: "🐍" },
  { name: "JavaScript", emoji: "⚡" },
  { name: "TypeScript", emoji: "📘" },
  { name: "Java", emoji: "☕" },
  { name: "Go", emoji: "🔵" },
  { name: "Rust", emoji: "🦀" },
  { name: "C++", emoji: "⬜" },
  { name: "C#", emoji: "🟣" },
  { name: "PHP", emoji: "🐘" },
  { name: "Ruby", emoji: "💎" },
]

export function MultiLanguageSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Multi-Language Support</h2>
          <p className="text-xl text-slate-300">
            Compare and analyze code across 50+ programming languages and text formats
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
        >
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors duration-300 border border-cyan-500/10 hover:border-cyan-500/30"
            >
              <span className="text-4xl mb-2">{lang.emoji}</span>
              <span className="text-sm font-medium text-slate-200 text-center">{lang.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
