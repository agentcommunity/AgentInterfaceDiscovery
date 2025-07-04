import Link from "next/link"
import { Code, Github, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function VisionSection() {
  return (
    <section className="w-full section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Built for a 
              <span className="text-muted-foreground"> polyglot world</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AID is designed to be a universal standard. We support TypeScript, Python, and Go out of the box, 
              with the canonical schema allowing anyone to build compatible libraries for any language.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="card-feature text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Multi-Language Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Official SDKs for <strong>TypeScript</strong>, <strong>Python</strong>, and <strong>Go</strong> are now available. 
                  Want to build an SDK for another language? We&apos;d love your help!
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-feature text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Open Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our tools are open source and welcome contributions. 
                  Check our <strong>roadmap</strong> for ways to get involved and help shape the future of agent discovery.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="pt-8">
            <Link
              href="https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/TODO.md"
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group")}
            >
              View the Roadmap 
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 