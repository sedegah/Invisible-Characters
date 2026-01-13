import dynamic from "next/dynamic"

const PortfolioNavbar = dynamic(() => import("@/components/PortfolioNavbar"), { ssr: false })
const ProductTeaserCard = dynamic(() => import("@/components/ProductTeaserCard"), { ssr: false })
const BankingScaleHero = dynamic(() => import("@/components/BankingScaleHero"), { ssr: false })
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false })
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false })

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard />
      <BankingScaleHero />
      <FAQSection />
      <Footer />
    </>
  )
}
