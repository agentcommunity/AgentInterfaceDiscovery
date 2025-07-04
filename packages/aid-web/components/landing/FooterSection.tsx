import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="w-full border-t border-border/50 bg-card/50 backdrop-blur-soft">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Project</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link 
                href="https://docs.agentcommunity.org/specs/aid/spec-v1/" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Specification
              </Link>
              <Link href="/generate" className="block text-muted-foreground hover:text-foreground transition-colors">
                Generator
              </Link>
              <Link href="/validate" className="block text-muted-foreground hover:text-foreground transition-colors">
                Validator
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Community</h4>
            <div className="space-y-2">
              <Link 
                href="https://github.com/agentcommunity/AgentInterfaceDiscovery" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link 
                href="https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/CONTRIBUTING.md" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Contributing
              </Link>
              <Link 
                href="https://github.com/agentcommunity/AgentInterfaceDiscovery/issues" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Issues
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">JavaScript/TypeScript</h4>
            <div className="space-y-2">
              <Link 
                href="https://www.npmjs.com/package/@agentcommunity/aid-core" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                aid-core
              </Link>
              <Link 
                href="https://www.npmjs.com/package/@agentcommunity/aid-conformance" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                aid-conformance
              </Link>
              <Link 
                href="https://www.npmjs.com/package/@agentcommunity/aid-schema" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                aid-schema
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Other Languages</h4>
            <div className="space-y-2">
              <Link 
                href="https://pypi.org/project/aid-core-py/" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Python SDK
              </Link>
              <Link 
                href="https://pkg.go.dev/github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Go SDK
              </Link>
              <Link 
                href="https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/TODO.md" 
                target="_blank" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Contribute SDK
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 The Agent Community. Built with ❤️ for the AI community.
          </p>
        </div>
      </div>
    </footer>
  )
} 