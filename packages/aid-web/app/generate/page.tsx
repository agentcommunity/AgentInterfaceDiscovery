"use client"

import { ConfigForm } from "@/components/config-form"
import { GeneratorFormProvider } from "@/components/generator-form-provider"
import { OutputPanel } from "@/components/output-panel"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function GeneratorPage() {
  const scrollToOutput = () => {
    document.getElementById("output-panel")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <GeneratorFormProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden mb-4">
          <Button onClick={scrollToOutput} className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View Live Output
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 space-y-8 md:space-y-0">
          <div className="flex-shrink-0">
            <ConfigForm />
          </div>
          <div id="output-panel" className="h-full">
            <OutputPanel />
          </div>
        </div>
      </div>
    </GeneratorFormProvider>
  )
} 