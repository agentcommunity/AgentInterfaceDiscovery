"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfigForm } from "@/components/config-form"
import { OutputPanel } from "@/components/output-panel"
import { SampleLoader } from "@/components/sample-loader"
import { aidGeneratorConfigSchema, type AidGeneratorConfig } from "@aid/core/browser"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function GeneratorPage() {
  const [output, setOutput] = useState<{ manifest: string; txtRecord: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<AidGeneratorConfig>({
    resolver: zodResolver(aidGeneratorConfigSchema),
    mode: "onChange",
  })

  const { formState, reset } = form
  const hasServiceErrors = !!formState.errors.domain
  const hasMetadataErrors = !!formState.errors.metadata
  const hasImplementationsErrors = !!formState.errors.implementations

  const handleLoadSample = (config: AidGeneratorConfig) => {
    reset(config)
    setOutput(null)
    toast.success("Sample configuration loaded.")
  }

  const onSubmit = async (data: AidGeneratorConfig) => {
    setIsGenerating(true)
    setOutput(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || "An unknown error occurred.")
      }

      const result = await response.json()
      setOutput(result)
      toast.success("Profile generated successfully!")
    } catch (error: any) {
      console.error("Generation failed:", error)
      toast.error("Generation Failed", { description: error.message })
      setOutput(null)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">AID Profile Generator</h1>
            <SampleLoader onLoadSample={handleLoadSample} />
          </div>
          <ConfigForm
            form={form}
            onSubmit={onSubmit}
            isGenerating={isGenerating}
            hasServiceErrors={hasServiceErrors}
            hasMetadataErrors={hasMetadataErrors}
            hasImplementationsErrors={hasImplementationsErrors}
          />
        </div>
        <OutputPanel output={output} />
      </div>
      <Toaster />
    </div>
  )
}
