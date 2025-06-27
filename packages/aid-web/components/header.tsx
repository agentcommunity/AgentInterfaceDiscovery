"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, BookText } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Bot className="h-6 w-6" />
          <span className="text-lg">AID</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: pathname === "/" ? "secondary" : "ghost" }))}
          >
            Generator
          </Link>
          <Link
            href="/resolve"
            className={cn(buttonVariants({ variant: pathname === "/resolve" ? "secondary" : "ghost" }))}
          >
            Resolver
          </Link>
          <Link
            href="/validate"
            className={cn(buttonVariants({ variant: pathname === "/validate" ? "secondary" : "ghost" }))}
          >
            Validator
          </Link>
          <a
            href="https://docs.agentcommunity.org/specs/aid/spec-v1/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}
          >
            <BookText />
            Documentation
          </a>
        </nav>
      </div>
    </header>
  )
} 