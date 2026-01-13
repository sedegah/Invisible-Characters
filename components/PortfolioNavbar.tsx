"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"

const navigationLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Unicode Scanner",
    href: "/unicode-scanner",
  },
  {
    name: "Docs",
    href: "/docs",
  },
] as any[]

// @component: PortfolioNavbar
export const PortfolioNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    setMounted(true)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLinkClick = (href: string) => {
    closeMobileMenu()
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        })
      }
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              {mounted && (
                <Image
                  src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
                  alt="Invisible Characters"
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              )}
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href)
                return link.href.startsWith("#") ? (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className={`text-foreground hover:text-primary px-3 py-2 text-base font-medium transition-colors duration-200 relative group ${isActive ? "text-primary" : ""}`}
                    style={{
                      fontFamily: "Figtree, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    <span>{link.name}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-foreground hover:text-primary px-3 py-2 text-base font-medium transition-colors duration-200 relative group ${isActive ? "text-primary" : ""}`}
                    style={{
                      fontFamily: "Figtree, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    <span>{link.name}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* CTA removed per request to remove Code Comparator */}

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-6 space-y-4">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href
                return link.href.startsWith("#") ? (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className={`block w-full text-left text-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-200 ${isActive ? "text-primary" : ""}`}
                    style={{
                      fontFamily: "Figtree, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    <span>{link.name}</span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block w-full text-left text-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-200 ${isActive ? "text-primary" : ""}`}
                    style={{
                      fontFamily: "Figtree, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    <span>{link.name}</span>
                  </Link>
                )
              })}
              {/* Mobile CTA removed per request */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
