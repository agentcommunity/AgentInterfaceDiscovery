"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfigForm } from "@/components/config-form"
import { OutputPanel } from "@/components/output-panel"
import { SampleLoader } from "@/components/sample-loader"
import {
  aidGeneratorConfigSchema,
  type AidGeneratorConfig,
  type ImplementationConfig,
  buildManifest,
  buildTxtRecord,
} from "@aid/core/browser"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { z } from "zod"

const defaultImplementation: Omit<ImplementationConfig, "name" | "type" | "protocol" | "authentication"> = {
  tags: [],
  status: "active",
  revocationURL: "",
  configuration: [],
  requiredPaths: [],
}

const defaultValues: AidGeneratorConfig = {
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
}

export default function GeneratorPage() {
  const [output, setOutput] = useState<{ manifest: string; txtRecord: string } | null>(null)

  const form = useForm<AidGeneratorConfig>({
    resolver: zodResolver(aidGeneratorConfigSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  })

  const { formState, reset, watch } = form
  const debouncedForm = useDebounce(watch(), 500)

  const hasServiceErrors = !!formState.errors.domain
  const hasMetadataErrors = !!formState.errors.metadata
  const hasImplementationsErrors = !!formState.errors.implementations

  const handleLoadSample = (config: AidGeneratorConfig) => {
    const mergedConfig = {
      ...defaultValues,
      ...config,
      metadata: { ...defaultValues.metadata, ...config.metadata },
      implementations: config.implementations.map(impl => ({
        ...defaultImplementation,
        ...impl,
      })),
    }
    reset(mergedConfig)

    // HACK: setValue is needed because react-hook-form's reset doesn't
    // always correctly update the controlled value of the field, especially
    // after complex state changes. This ensures the UI reflects the loaded sample.
    form.setValue("serviceName", mergedConfig.serviceName)
    form.setValue("domain", mergedConfig.domain)

    // Manually trigger output generation after loading a sample
    try {
      const manifest = buildManifest(mergedConfig);
      const txtRecord = buildTxtRecord(mergedConfig);
      setOutput({
        manifest: JSON.stringify(manifest, null, 2),
        txtRecord,
      });
    } catch (e) {
      // If the sample is invalid for some reason, clear the output
      // This might happen with partial/old sample files.
      setOutput(null);
      console.error("Failed to build manifest from sample:", e)
    }
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const formValues = form.getValues();
      try {
        const manifest = buildManifest(formValues);
        const txtRecord = buildTxtRecord(formValues);
        setOutput({
          manifest: JSON.stringify(manifest, null, 2),
          txtRecord,
        });
      } catch (error) {
        // In case buildManifest fails with invalid partial data,
        // we can clear the output or handle it gracefully.
        // For now, let's allow it to clear so we know there's a build issue.
        setOutput(null)
      }
    });
    return () => subscription.unsubscribe();
  }, [form, watch]);

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
            hasServiceErrors={hasServiceErrors}
            hasMetadataErrors={hasMetadataErrors}
            hasImplementationsErrors={hasImplementationsErrors}
          />
        </div>
        <div className="sticky top-8">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  )
}
