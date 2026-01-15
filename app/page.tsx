"use client"

import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/ProductTeaserCard"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard 
        primaryButtonHref="/unicode-scanner"
        secondaryButtonHref="/code-comparator"
      />
      <div className="hidden md:block">
        <FAQSection />
      </div>
      <Footer />
    </>
  )
}
