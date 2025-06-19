"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfigForm } from "@/components/config-form"
import { OutputPanel } from "@/components/output-panel"
import { SampleLoader } from "@/components/sample-loader"
import { aidGeneratorConfigSchema } from "@/lib/schemas"
import { buildManifest, buildTxtRecord } from "@/lib/generator"
import type { AidGeneratorConfig } from "@aid/core"

type Output = {
  manifest: string
  txt: string
  digCommand: string
  curlCommand: string
}

const defaultValues = {
  schemaVersion: "1",
  serviceName: "",
  domain: "",
  env: "",
  metadata: {
    contentVersion: "",
    documentation: "",
    revocationURL: "",
  },
  implementations: [],
} as AidGeneratorConfig

export default function GeneratorPage() {
  const [output, setOutput] = useState<Output | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<AidGeneratorConfig>({
    resolver: zodResolver(aidGeneratorConfigSchema),
    defaultValues,
    mode: "onChange",
  })

  const domain = form.watch("domain")

  const handleGenerate = useCallback((data: AidGeneratorConfig) => {
    setIsGenerating(true)
    try {
      const manifest = buildManifest(data)
      const manifestString = JSON.stringify(manifest, null, 2)
      const txt = buildTxtRecord(data)
      const digCommand = data.domain ? `dig +short TXT _agent.${data.domain}` : ""
      const curlCommand = data.domain ? `curl https://${data.domain}/.well-known/aid.json` : ""

      setOutput({
        manifest: manifestString,
        txt: txt,
        digCommand,
        curlCommand,
      })
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  useEffect(() => {
    const subscription = form.watch(() => handleGenerate(form.getValues()))
    handleGenerate(form.getValues()) // Initial generation
    return () => subscription.unsubscribe()
  }, [form, handleGenerate])

  const handleLoadSample = (config: AidGeneratorConfig) => {
    form.reset(config)
    form.trigger()
  }

  const { errors } = form.formState
  const hasServiceErrors = !!(errors.serviceName || errors.domain)
  const hasMetadataErrors = !!errors.metadata
  const hasImplementationsErrors = !!errors.implementations

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">AID Generator</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Fill out the form below to generate your `aid.json` manifest and DNS TXT record instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>
            <SampleLoader onLoadSample={handleLoadSample} />
          </div>
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <ConfigForm
              form={form}
              onSubmit={() => {
                handleGenerate(form.getValues())
              }}
              isGenerating={isGenerating}
              hasServiceErrors={hasServiceErrors}
              hasMetadataErrors={hasMetadataErrors}
              hasImplementationsErrors={hasImplementationsErrors}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Output</h2>
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm flex flex-col">
            <OutputPanel
              output={output}
              domain={domain || "example.com"}
              errorCount={Object.keys(form.formState.errors).length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
