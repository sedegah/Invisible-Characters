"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, GitCompare } from "lucide-react"

type ProductTeaserCardProps = {
  headline?: string
  subheadline?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
}

export const ProductTeaserCard = (props: ProductTeaserCardProps) => {
  const {
    headline = "Code Analysis & Security in One Platform",
    subheadline = "Detect hidden Unicode threats and compare code snippets across languages. Build secure, reliable code with Code Comparator's developer-first tools.",
    primaryButtonText = "Try Unicode Scanner",
    primaryButtonHref = "",
    secondaryButtonText = "Try Code Comparator",
    secondaryButtonHref = "",
  } = props

  return (
    <section className="w-full px-4 sm:px-8 pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-2 sm:gap-4">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
            }}
            className="col-span-12 lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-[40px] p-6 sm:p-12 lg:p-16 flex flex-col justify-end aspect-square overflow-hidden relative border border-slate-700"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{
                  transform: "translateY(20px)",
                  opacity: 0,
                }}
                animate={{
                  transform: "translateY(0px)",
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.645, 0.045, 0.355, 1],
                  delay: 0.3,
                }}
                className="flex gap-2 mb-3.5 sm:mb-7"
              >
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                <GitCompare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </motion.div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[56px] leading-tight sm:leading-[60px] tracking-tight text-white max-w-[520px] mb-4 sm:mb-6"
                style={{
                  fontWeight: "500",
                  fontFamily: "var(--font-figtree), Figtree",
                }}
              >
                {headline}
              </h1>

              <p
                className="text-sm sm:text-lg leading-6 sm:leading-7 text-slate-300 max-w-[520px] mb-6 sm:mb-10"
                style={{
                  fontFamily: "var(--font-figtree), Figtree",
                }}
              >
                {subheadline}
              </p>

              <ul className="flex gap-1.5 flex-wrap">
                <li>
                  <Link
                    href={primaryButtonHref || "/unicode-scanner"}
                    className="block cursor-pointer text-white bg-blue-600 rounded-full px-3 sm:px-[18px] py-2.5 sm:py-[15px] text-xs sm:text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl hover:bg-blue-700"
                  >
                    {primaryButtonText}
                  </Link>
                </li>
                <li>
                  <Link
                    href={secondaryButtonHref || "/code-comparator"}
                    className="block cursor-pointer text-white border border-slate-400 rounded-full px-3 sm:px-[18px] py-2.5 sm:py-[15px] text-xs sm:text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl hover:bg-slate-700/50"
                  >
                    {secondaryButtonText}
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
              delay: 0.2,
            }}
            className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-2 sm:gap-4 aspect-square"
          >
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-[40px] p-4 sm:p-8 border border-slate-700 flex flex-col justify-between">
              <div>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-xl font-semibold text-white mb-1 sm:mb-2">Unicode Scanner</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">Detect hidden Unicode threats</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl sm:rounded-[40px] p-4 sm:p-8 border border-blue-700 flex flex-col justify-between">
              <div>
                <GitCompare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-xl font-semibold text-white mb-1 sm:mb-2">Code Comparator</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">Compare across languages</p>
            </div>

            {/* Stats */}
            <div className="col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl sm:rounded-[40px] p-4 sm:p-8 border border-slate-700">
              <p className="text-xs sm:text-base text-slate-300 mb-1 sm:mb-2">Free & Open Source</p>
              <p className="text-xl sm:text-3xl font-bold text-white">Available Worldwide</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
