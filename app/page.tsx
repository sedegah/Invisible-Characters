import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/ProductTeaserCard"
import { BankingScaleHero } from "@/components/BankingScaleHero"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/Footer"
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper"

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard />
      <ClientOnlyWrapper>
        <BankingScaleHero />
        <FAQSection />
        <Footer />
      </ClientOnlyWrapper>
    </>
  )
}
