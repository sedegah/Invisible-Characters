"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is Code Comparator and Unicode Scanner?",
    answer:
      "Code Comparator is a free, open-source suite of tools for developers. Unicode Scanner detects hidden Unicode characters that could indicate security threats, while Code Comparator enables side-by-side comparison of code snippets across 50+ programming languages.",
  },
  {
    question: "How does Unicode Scanner work?",
    answer:
      "Unicode Scanner analyzes your code or text to identify suspicious or hidden Unicode characters. It shows exact positions and provides Unicode reference details to help you identify obfuscated code, potential injection attacks, or security vulnerabilities before deployment.",
  },
  {
    question: "Which programming languages does Code Comparator support?",
    answer:
      "Code Comparator supports 50+ programming languages including Python, JavaScript, TypeScript, Java, Go, Rust, C++, C#, PHP, Ruby, and many more. It also works with plain text and various markup formats.",
  },
  {
    question: "Is Code Comparator really free?",
    answer:
      "Yes, Code Comparator is completely free and open-source. You can use both Unicode Scanner and Code Comparator without any restrictions, charge, or sign-up required. We believe developers should have access to powerful tools at no cost.",
  },
]

export const FAQSection = ({ title = "Frequently asked questions", faqs = defaultFAQs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-24 px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2
              className="text-[40px] leading-tight font-normal text-white tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {title}
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-700 last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-white pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-6 h-6 text-cyan-400" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-slate-300"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
