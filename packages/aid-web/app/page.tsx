import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Github,
  ExternalLink,
  Package,
  Star,
  FileText,
  Globe,
  Plug,
} from "lucide-react"
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
    <main className="flex flex-col items-center px-4 pb-24 pt-12 md:pt-20 text-center max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6 mb-20 w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Agent Interface Discovery (AID)</h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
          A universal, open standard for making AI agents discoverable and interoperable.
        </p>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Stop writing custom clients. Make your agent discoverable from its domain name with a single DNS record and a verifiable manifest file.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://docs.agentcommunity.org/specs/aid/spec-v1/"
            target="_blank"
            className={buttonVariants({ size: "lg" })}
          >
            Read the Specification <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/resolve" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Try the Resolver <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/agentcommunity/AgentInterfaceDiscovery"
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Github className="mr-2 h-4 w-4" /> View on GitHub <Star className="ml-1 h-4 w-4 text-yellow-500" />
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="space-y-6 mb-20 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold">
          If you've ever built or used an AI agent, this probably looks familiar...
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
          <li>Manually configuring API keys and authentication schemes for every new agent.</li>
          <li>No standard way to discover an agent's capabilities or required configuration.</li>
          <li>Inconsistent and hard-to-validate setup instructions scattered across READMEs.</li>
          <li>Every integration is a custom, one-off project.</li>
        </ul>
      </section>

      {/* Solution Section */}
      <section className="space-y-8 mb-20 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Discover any agent from its domain name.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DNS record first */}
          <div className="flex flex-col items-center text-center p-4 border rounded-lg">
            <Globe className="h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-1">Point Your Domain</h3>
            <p className="text-muted-foreground text-sm">
              Add a single TXT record to your DNS. Clients can now resolve your agent's URI and authentication scheme directly.
            </p>
          </div>
          {/* Manifest second */}
          <div className="flex flex-col items-center text-center p-4 border rounded-lg">
            <FileText className="h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-1">Add a Manifest</h3>
            <p className="text-muted-foreground text-sm">
              Need more power? Point that DNS record to an <code className="font-mono">aid.json</code> describing endpoints, auth, and capabilities.
            </p>
          </div>
          {/* Connect third */}
          <div className="flex flex-col items-center text-center p-4 border rounded-lg">
            <Plug className="h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-1">Connect Programmatically</h3>
            <p className="text-muted-foreground text-sm">
              Clients automatically discover, authenticate, and interact—zero manual configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Toolkit Section */}
      <section className="space-y-8 mb-20 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">A suite of high-quality, open-source tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* aid-core */}
          <div className="border p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">@agentcommunity/aid-core</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Lightweight library for building and parsing AID manifests. Browser-safe & fully tree-shakable.
              </p>
            </div>
            <Link
              href="https://www.npmjs.com/package/@agentcommunity/aid-core"
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View on NPM <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* aid-conformance */}
          <div className="border p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">@agentcommunity/aid-conformance</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Powerful CLI to validate manifests against the spec—perfect for CI/CD pipelines.
              </p>
            </div>
            <Link
              href="https://www.npmjs.com/package/@agentcommunity/aid-conformance"
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View on NPM <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* aid-schema */}
          <div className="border p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">@agentcommunity/aid-schema</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The language-agnostic JSON Schema file—ideal for generating typed models in any language.
              </p>
            </div>
            <Link
              href="https://www.npmjs.com/package/@agentcommunity/aid-schema"
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View on NPM <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="space-y-8 mb-20 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Get Started in 60 Seconds</h2>
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto mb-4">
            <TabsTrigger value="discover">Discover an Agent</TabsTrigger>
            <TabsTrigger value="implement">Implement the Spec</TabsTrigger>
            <TabsTrigger value="validate">Validate a Manifest</TabsTrigger>
            <TabsTrigger value="nojs">Not Using JS</TabsTrigger>
          </TabsList>

          {/* Discover tab */}
          <TabsContent value="discover" className="space-y-4">
            <Codeblock
              title="Resolve any agent by domain"
              content={`import { resolveDomain } from '@agentcommunity/aid-core'\n\nfor await (const step of resolveDomain('agentcommunity.org')) {\n  console.log(step)\n}`}
            />
          </TabsContent>

          <TabsContent value="implement" className="space-y-4">
            <Codeblock title="Install" content="npm install @agentcommunity/aid-core" />
            <Codeblock
              title="Build a Manifest"
              content={`import { buildManifest } from '@agentcommunity/aid-core'\n\nconst manifest = buildManifest({\n  name: 'My Agent',\n  // ...more config\n})`}
            />
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <Codeblock
              title="Run the CLI"
              content={`npx @agentcommunity/aid-conformance aid-validate ./my-manifest.json`}
            />
          </TabsContent>

          <TabsContent value="nojs" className="space-y-4">
            <Codeblock
              title="Validate with curl & jq"
              content={`curl -sL https://unpkg.com/@agentcommunity/aid-schema | jq`}
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* Vision & Roadmap Section */}
      <section className="space-y-6 mb-24 text-left w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Built for a polyglot world</h2>
        <p className="text-lg text-foreground max-w-3xl mx-auto text-center">
          AID is designed to be a universal standard. While our core tooling is built with TypeScript, the canonical schema allows anyone to build compatible libraries.
          Official SDKs for other popular languages are on the way—first up: <strong>Python</strong> and <strong>Go</strong>.
        </p>
        <p className="text-lg text-foreground max-w-3xl mx-auto text-center">
          Interested in building a library for your favorite language? We'd love your help!
        </p>
        <div className="text-center">
          <Link
            href="https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/TODO.md"
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See the Roadmap <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t pt-10 text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center md:text-left space-y-2">
          <h4 className="font-semibold text-foreground">Project</h4>
          <Link href="/" className="block hover:underline">Home</Link>
          <Link href="https://docs.agentcommunity.org/specs/aid/spec-v1/" target="_blank" className="block hover:underline">About</Link>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h4 className="font-semibold text-foreground">Community</h4>
          <Link href="https://github.com/agentcommunity/AgentInterfaceDiscovery" target="_blank" className="block hover:underline">GitHub</Link>
          <Link href="https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/CONTRIBUTING.md" target="_blank" className="block hover:underline">Contributing Guide</Link>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h4 className="font-semibold text-foreground">Ecosystem</h4>
          <Link href="https://docs.agentcommunity.org/specs/aid/spec-v1/" target="_blank" className="block hover:underline">Documentation</Link>
          <Link href="https://www.npmjs.com/org/agentcommunity" target="_blank" className="block hover:underline">NPM Packages</Link>
        </div>
        <div className="md:col-span-3 text-center pt-8 border-t text-xs">© 2025 The Agent Community. MIT License.</div>
      </footer>
    </main>
  )
}
