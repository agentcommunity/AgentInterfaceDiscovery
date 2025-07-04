import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ExternalLink, Github, Star, Sparkles } from "lucide-react"
import { CopyButton } from "@/components/resolver/CopyButton"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative w-full section-padding text-center">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-balance">
              Agent Interface
              <span className="block text-muted-foreground">Discovery</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A universal, open standard for making AI agents discoverable and interoperable. 
              Stop writing custom clients—make your agent discoverable from its domain name.
            </p>
          </div>

          {/* Animated Stats */}
          <div className="flex justify-center my-8">
            <div className="bg-card border border-border/50 rounded-lg px-6 py-3 shadow-soft-sm">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="font-semibold tabular-nums">
                  6,530,632
                </span>
                <span className="text-muted-foreground">hours of compute saved</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/resolve" 
              className={cn(buttonVariants({ size: "xl", variant: "default" }), "group")}
            >
              Try the Resolver 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="https://docs.agentcommunity.org/specs/aid/spec-v1/"
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "xl" }), "group")}
            >
              Read the Specification 
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Install Command */}
          <div className="flex justify-center pt-4">
            <div className="bg-card border border-border/50 rounded-xl px-6 py-4 shadow-soft-lg max-w-md">
              <div className="flex items-center gap-4 font-mono text-sm">
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">npm install @agentcommunity/aid-core</span>
                <CopyButton textToCopy="npm install @agentcommunity/aid-core" />
              </div>
            </div>
          </div>

          {/* GitHub Link */}
          <div className="flex justify-center pt-2">
            <Link
              href="https://github.com/agentcommunity/AgentInterfaceDiscovery"
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "group")}
            >
              <Github className="mr-2 h-4 w-4" /> 
              View on GitHub
              <Star className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 