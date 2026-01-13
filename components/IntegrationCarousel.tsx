"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type IntegrationApp = {
  name: string;
  logo: string;
};

type Language = {
  name: string;
  icon: string;
};

type IntegrationCarouselProps = {
  buttonText?: string;
  buttonHref?: string;
  title?: string;
  subtitle?: string;
  topRowApps?: IntegrationApp[];
  bottomRowApps?: IntegrationApp[];
};

const defaultTopRowApps: IntegrationApp[] = [
  { name: "Integration 1", logo: "/images/logoipsum-389.png" },
  { name: "Integration 2", logo: "/images/logoipsum-407.png" },
  { name: "Integration 3", logo: "/images/logoipsum-379.png" },
  { name: "Integration 4", logo: "/images/logoipsum-374.png" },
  { name: "Integration 5", logo: "/images/logoipsum-381.png" },
  { name: "Integration 6", logo: "/images/logoipsum-401.png" },
  { name: "Integration 7", logo: "/images/logoipsum-403.png" },
  { name: "Integration 1", logo: "/images/logoipsum-389.png" },
  { name: "Integration 2", logo: "/images/logoipsum-407.png" },
  { name: "Integration 3", logo: "/images/logoipsum-379.png" },
  { name: "Integration 4", logo: "/images/logoipsum-374.png" },
  { name: "Integration 5", logo: "/images/logoipsum-381.png" },
];

const defaultBottomRowApps: IntegrationApp[] = [
  { name: "Integration 6", logo: "/images/logoipsum-401.png" },
  { name: "Integration 7", logo: "/images/logoipsum-403.png" },
  { name: "Integration 1", logo: "/images/logoipsum-389.png" },
  { name: "Integration 2", logo: "/images/logoipsum-407.png" },
  { name: "Integration 3", logo: "/images/logoipsum-379.png" },
  { name: "Integration 4", logo: "/images/logoipsum-374.png" },
  { name: "Integration 5", logo: "/images/logoipsum-381.png" },
  { name: "Integration 6", logo: "/images/logoipsum-401.png" },
  { name: "Integration 7", logo: "/images/logoipsum-403.png" },
  { name: "Integration 1", logo: "/images/logoipsum-389.png" },
  { name: "Integration 2", logo: "/images/logoipsum-407.png" },
  { name: "Integration 3", logo: "/images/logoipsum-379.png" },
];

const languages: Language[] = [
  { name: "Python", icon: "🐍" },
  { name: "JavaScript", icon: "⚡" },
  { name: "TypeScript", icon: "📘" },
  { name: "Java", icon: "☕" },
  { name: "Go", icon: "🔵" },
  { name: "Rust", icon: "🦀" },
  { name: "C++", icon: "⬜" },
  { name: "C#", icon: "🟣" },
  { name: "PHP", icon: "🐘" },
  { name: "Ruby", icon: "💎" },
];

export const IntegrationCarousel = ({
  buttonText = "Explore Integrations",
  buttonHref = "#",
  title = "Integrates with your entire collaboration stack.",
  subtitle = "Connect Auralink to Slack, Zoom, Notion, Google Meet, and dozens of others to analyze communication seamlessly.",
  topRowApps = defaultTopRowApps,
  bottomRowApps = defaultBottomRowApps,
}: IntegrationCarouselProps) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let topAnimationId: number;
    let bottomAnimationId: number;
    let topPosition = 0;
    let bottomPosition = 0;

    const animateTopRow = () => {
      if (topRowRef.current) {
        topPosition -= 0.5;
        if (Math.abs(topPosition) >= topRowRef.current.scrollWidth / 2) topPosition = 0;
        topRowRef.current.style.transform = `translateX(${topPosition}px)`;
      }
      topAnimationId = requestAnimationFrame(animateTopRow);
    };

    const animateBottomRow = () => {
      if (bottomRowRef.current) {
        bottomPosition -= 0.65;
        if (Math.abs(bottomPosition) >= bottomRowRef.current.scrollWidth / 2) bottomPosition = 0;
        bottomRowRef.current.style.transform = `translateX(${bottomPosition}px)`;
      }
      bottomAnimationId = requestAnimationFrame(animateBottomRow);
    };

    topAnimationId = requestAnimationFrame(animateTopRow);
    bottomAnimationId = requestAnimationFrame(animateBottomRow);

    return () => {
      cancelAnimationFrame(topAnimationId);
      cancelAnimationFrame(bottomAnimationId);
    };
  }, []);

  // @return
  return (
    <div className="w-full py-24 bg-white">
      <div className="max-w-[680px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-20"
        >
          <div className="flex flex-col items-center gap-4">
            <h2
              className="text-[40px] leading-tight font-normal text-[#222222] text-center tracking-tight mb-0"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
            <p
              className="text-lg leading-7 text-[#666666] text-center max-w-[600px] mt-2"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              {subtitle}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="flex gap-3 mt-6"
          >
            <a
              href={buttonHref}
              className="inline-block px-5 py-2.5 rounded-full bg-white text-[#222222] text-[15px] font-medium leading-6 text-center whitespace-nowrap transition-all duration-75 ease-out w-[182px] cursor-pointer hover:shadow-lg"
              style={{
                boxShadow:
                  "0 -1px 0 0 rgb(181, 181, 181) inset, -1px 0 0 0 rgb(227, 227, 227) inset, 1px 0 0 0 rgb(227, 227, 227) inset, 0 1px 0 0 rgb(227, 227, 227) inset",
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.06) 80%, rgba(255, 255, 255, 0.12))",
              }}
            >
              {buttonText}
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="h-[268px] -mt-6 mb-0 pb-0 relative overflow-hidden">
        <div
          ref={topRowRef}
          className="flex items-start gap-6 absolute top-6 whitespace-nowrap"
          style={{
            willChange: "transform",
          }}
        >
          {[...topRowApps, ...topRowApps].map((app, index) => (
            <div
              key={`top-${index}`}
              className="flex items-center justify-center w-24 h-24 rounded-3xl flex-shrink-0"
              style={{
                backgroundImage: "linear-gradient(rgb(255, 255, 255), rgb(252, 252, 252))",
                boxShadow:
                  "rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.4px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px, rgba(0, 0, 0, 0.04) 0px 12px 12px -12px",
              }}
            >
              <img src={app.logo || "/placeholder.svg"} alt={app.name} className="w-9 h-9 block object-contain" />
            </div>
          ))}
        </div>

        <div
          className="absolute top-0 right-0 bottom-0 w-60 h-[268px] z-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0), rgb(255, 255, 255))",
          }}
        />

        <div
          className="absolute top-0 left-0 bottom-0 w-60 h-[268px] z-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255), rgba(0, 0, 0, 0))",
          }}
        />

        <div
          ref={bottomRowRef}
          className="flex items-start gap-6 absolute top-[148px] whitespace-nowrap"
          style={{
            willChange: "transform",
          }}
        >
          {[...bottomRowApps, ...bottomRowApps].map((app, index) => (
            <div
              key={`bottom-${index}`}
              className="flex items-center justify-center w-24 h-24 rounded-3xl flex-shrink-0"
              style={{
                backgroundImage: "linear-gradient(rgb(255, 255, 255), rgb(252, 252, 252))",
                boxShadow:
                  "rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.4px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px, rgba(0, 0, 0, 0.04) 0px 12px 12px -12px",
              }}
            >
              <img src={app.logo || "/placeholder.svg"} alt={app.name} className="w-9 h-9 block object-contain" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-[40px] leading-tight font-normal text-white text-center tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              Multi-Language Support
            </h2>
            <p
              className="text-lg leading-7 text-slate-300 text-center max-w-2xl mx-auto"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
              }}
            >
              Compare and analyze code across 50+ programming languages and text formats
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col items-center justify-center"
              >
                <div className="text-4xl mb-3">{lang.icon}</div>
                <p className="text-sm font-medium text-white text-center">{lang.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
