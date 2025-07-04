import type { Metadata } from "next"
import { HeroSection } from "@/components/landing/HeroSection"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { SolutionSection } from "@/components/landing/SolutionSection"
import { ToolkitSection } from "@/components/landing/ToolkitSection"
import { QuickStartSection } from "@/components/landing/QuickStartSection"
import { VisionSection } from "@/components/landing/VisionSection"
import { FooterSection } from "@/components/landing/FooterSection"

export const metadata: Metadata = {
  title: "Agent Interface Discovery (AID)",
  description: "A universal specification for discovering and consuming AI Agent services.",
  openGraph: {
    title: "Agent Interface Discovery (AID)",
    description: "A universal specification for discovering and consuming AI Agent services.",
    url: "https://aid.agentcommunity.org/",
    siteName: "AID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AID logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AID: Agent Interface Discovery",
    description: "A universal specification for discovering and consuming AI Agent services.",
    images: ["/og-image.png"],
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ToolkitSection />
      <QuickStartSection />
      <VisionSection />
      <FooterSection />
    </main>
  )
}
