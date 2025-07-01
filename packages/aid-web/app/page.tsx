import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Github, ExternalLink, Package } from "lucide-react"
import type { Metadata } from "next"
import { Codeblock } from "@/components/resolver/Codeblock"

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
    title: "Agent Interface Discovery (AID)",
    description: "A universal specification for discovering and consuming AI Agent services.",
    images: ["/og-image.png"],
  },
}

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center px-4 pb-16 pt-12 md:pt-20 text-center max-w-3xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          AID: A Universal Specification for Discovering AI Agents
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Discover, integrate, and validate AI agent services with a single DNS query. Built on open standards — free, fast, and vendor-neutral.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="https://docs.agentcommunity.org/specs/aid/spec-v1/" target="_blank" className={buttonVariants({ size: "lg" })}>
            View the Spec <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/generate" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Section */}
      <section className="space-y-4 mb-16 text-left">
        <h2 className="text-3xl md:text-4xl font-bold">Why does the agentic web need AID?</h2>
        <p className="text-muted-foreground">
          The rise of agent-based and LLM-powered services has created a Wild West of proprietary discovery mechanisms. Manual configuration, scattered documentation, and fragile hard-coded URLs slow teams down and break integrations.
          AID solves this with a lightweight, backwards-compatible protocol that piggybacks on DNS and HTTPS. Point clients at a domain — they learn everything else automatically.
        </p>
      </section>

      {/* What Section */}
      <section className="space-y-4 mb-16 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold">What's in the box?</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">@aid/core</strong> — build &amp; resolve manifests programmatically.
          </li>
          <li>
            <strong className="text-foreground">@aid/conformance</strong> — CLI &amp; test-suite to guarantee spec compliance.
          </li>
          <li>
            <strong className="text-foreground">@agentcommunity/aid-schema</strong> — the canonical JSON Schema, ready for any language.
          </li>
          <li>
            <strong className="text-foreground">Web Tools</strong> — interactive generator, resolver, and validator (see navigation).
          </li>
        </ul>
        <div className="mt-6">
          <Codeblock
            title="One-line service discovery"
            content={`for await (const step of resolveDomain('agentcommunity.org')) {\n  console.log(step)\n}`}
          />
        </div>
      </section>

      {/* Links Section */}
      <section className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-8">
        <Link href="https://github.com/agentcommunity/AgentInterfaceDiscovery" target="_blank" className={buttonVariants({ variant: "outline" })}>
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Link>
        <Link href="https://www.npmjs.com/org/agentcommunity" target="_blank" className={buttonVariants({ variant: "outline" })}>
          <Package className="mr-2 h-4 w-4" /> NPM Packages
        </Link>
        <Link href="https://docs.agentcommunity.org/specs/aid/spec-v1/" target="_blank" className={buttonVariants({ variant: "outline" })}>
          Documentation <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
