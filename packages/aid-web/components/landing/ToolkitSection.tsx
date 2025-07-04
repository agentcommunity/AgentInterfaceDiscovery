import Link from "next/link"
import { Package, CheckCircle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ToolkitSection() {
  const tools = [
    {
      name: "@agentcommunity/aid-core",
      description: "Lightweight TypeScript library for building and parsing AID manifests. Browser-safe & fully tree-shakable.",
      link: "https://www.npmjs.com/package/@agentcommunity/aid-core",
      features: ["TypeScript support", "Tree-shakable", "Browser compatible"],
    },
    {
      name: "@agentcommunity/aid-conformance",
      description: "Powerful CLI to validate manifests against the spec—perfect for CI/CD pipelines.",
      link: "https://www.npmjs.com/package/@agentcommunity/aid-conformance",
      features: ["CLI validation", "CI/CD ready", "Detailed reports"],
    },
    {
      name: "@agentcommunity/aid-schema",
      description: "The language-agnostic JSON Schema file—ideal for generating typed models in any language.",
      link: "https://www.npmjs.com/package/@agentcommunity/aid-schema",
      features: ["JSON Schema", "Language agnostic", "Code generation"],
    },
    {
      name: "aid-core-py",
      description: "Official Python SDK with Pydantic V2 models and validation helpers for working with AID manifests.",
      link: "https://pypi.org/project/aid-core-py/",
      features: ["Pydantic V2 models", "Python validation", "Auto-generated"],
    },
    {
      name: "aid-core-go",
      description: "Go SDK with canonical structs and validation helpers. Auto-generated from the JSON Schema.",
      link: "https://pkg.go.dev/github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore",
      features: ["Go structs", "Schema validation", "Auto-generated"],
    },
    {
      name: "@agentcommunity/aid-web",
      description: "Web-based tools for generating, validating, and resolving AID manifests with a beautiful UI.",
      link: "https://aid.agentcommunity.org/",
      features: ["Web interface", "Interactive tools", "Real-time validation"],
    },
  ]

  return (
    <section className="w-full section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              A comprehensive toolkit with 
              <span className="text-muted-foreground"> 6 open-source packages</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to implement AID across multiple languages and platforms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="card-feature group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-lg font-mono text-sm">{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={tool.link}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full group")}
                  >
                    View Package 
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 