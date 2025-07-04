"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, BookText, ExternalLink, Github, Menu, X } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Generator", href: "/generate" },
    { name: "Resolver", href: "/resolve" },
    { name: "Validator", href: "/validate" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-soft">
      <div className="container mx-auto container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold transition-colors hover:text-foreground group">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600">
              <Bot className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-white" />
            </div>
            <span className="text-xl tracking-tight text-foreground">AID</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  buttonVariants({ 
                    variant: pathname === item.href ? "secondary" : "ghost",
                    size: "sm"
                  }),
                  "transition-all duration-200"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Documentation Link */}
            <a
              href="https://docs.agentcommunity.org/aid/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-2 transition-all duration-200"
              )}
            >
              <BookText className="h-4 w-4" />
              Docs
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/agentcommunity/AgentInterfaceDiscovery"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2 transition-all duration-200"
              )}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    buttonVariants({ 
                      variant: pathname === item.href ? "secondary" : "ghost",
                      size: "sm"
                    }),
                    "justify-start transition-all duration-200"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-border/50 my-2" />
              
              <a
                href="https://docs.agentcommunity.org/specs/aid/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-start gap-2 transition-all duration-200"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookText className="h-4 w-4" />
                Documentation
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href="https://github.com/agentcommunity/AgentInterfaceDiscovery"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "justify-start gap-2 transition-all duration-200"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 