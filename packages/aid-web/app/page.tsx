import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Github, ExternalLink, Package } from "lucide-react"
import type { Metadata } from "next"
import { Codeblock } from "@/components/resolver/Codeblock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    <main className="flex flex-col items-center px-4 pb-16 pt-12 md:pt-20 text-center max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6 mb-16 w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">AID: Agent Interface Discovery</h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
          A universal specification for discovering and consuming AI Agent services. Built on open standards—free, fast, and vendor-neutral.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="https://docs.agentcommunity.org/specs/aid/spec-v1/" target="_blank" className={buttonVariants({ size: "lg" })}>
            Read the Spec <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/resolve" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Try the Resolver <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* What is AID? Section */}
      <section className="space-y-4 mb-16 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">What is AID?</h2>
        <p className="text-lg text-foreground">
          The rise of agent-based and LLM-powered services has created a Wild West of proprietary discovery mechanisms. Manual configuration, scattered documentation, and fragile hard-coded URLs slow teams down and break integrations. AID solves this with a lightweight, backwards-compatible protocol that piggybacks on DNS and HTTPS. Point clients at a domain—they learn everything else automatically.
        </p>
      </section>

      {/* Getting Started Section */}
      <section className="space-y-8 mb-16 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Get Started in Seconds</h2>
        <Tabs defaultValue="npm">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
          </TabsList>
          <TabsContent value="npm">
            <Codeblock title="Install Packages" content="npm install @agentcommunity/aid-core @agentcommunity/aid-conformance" />
          </TabsContent>
          <TabsContent value="pnpm">
            <Codeblock title="Install Packages" content="pnpm add @agentcommunity/aid-core @agentcommunity/aid-conformance" />
          </TabsContent>
          <TabsContent value="yarn">
            <Codeblock title="Install Packages" content="yarn add @agentcommunity/aid-core @agentcommunity/aid-conformance" />
          </TabsContent>
        </Tabs>
        <Codeblock
          title="One-Line Service Discovery"
          content={`for await (const step of resolveDomain('agentcommunity.org')) {\n  console.log(step)\n}`}
        />
      </section>

      {/* What's Included Section */}
      <section className="space-y-4 mb-16 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">What's Included?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <li className="border p-4 rounded-lg">
            <strong className="font-bold">@agentcommunity/aid-core</strong>
            <p className="text-muted-foreground">Build & resolve manifests programmatically.</p>
          </li>
          <li className="border p-4 rounded-lg">
            <strong className="font-bold">@agentcommunity/aid-conformance</strong>
            <p className="text-muted-foreground">CLI & test-suite to guarantee spec compliance.</p>
          </li>
          <li className="border p-4 rounded-lg">
            <strong className="font-bold">@agentcommunity/aid-schema</strong>
            <p className="text-muted-foreground">The canonical JSON Schema, ready for any language.</p>
          </li>
          <li className="border p-4 rounded-lg">
            <strong className="font-bold">Web Tools</strong>
            <p className="text-muted-foreground">Interactive generator, resolver, and validator.</p>
          </li>
        </ul>
      </section>

      {/* Links Section */}
      <section className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
        <Link href="https://github.com/agentcommunity/AgentInterfaceDiscovery" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Link>
        <Link href="https://www.npmjs.com/org/agentcommunity" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <Package className="mr-2 h-4 w-4" /> NPM Packages
        </Link>
        <Link href="/generate" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Create a Manifest <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
