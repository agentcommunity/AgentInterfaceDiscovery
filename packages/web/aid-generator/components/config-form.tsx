"use client"

import type { UseFormReturn } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ServiceSection } from "@/components/form-sections/service-section"
import { MetadataSection } from "@/components/form-sections/metadata-section"
import { ImplementationsSection } from "@/components/form-sections/implementations-section"
import { SignatureSection } from "@/components/form-sections/signature-section"
import { Separator } from "@/components/ui/separator"
import type { AidGeneratorConfig } from "@aid/core"

interface ConfigFormProps {
  form: UseFormReturn<AidGeneratorConfig>
  onSubmit: (data: AidGeneratorConfig) => void
  isGenerating: boolean
  hasServiceErrors: boolean
  hasMetadataErrors: boolean
  hasImplementationsErrors: boolean
}

export function ConfigForm({
  form,
  onSubmit,
  isGenerating,
  hasServiceErrors,
  hasMetadataErrors,
  hasImplementationsErrors,
}: ConfigFormProps) {
  const { formState } = form
  const hasErrors = !formState.isValid

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ServiceSection form={form} hasErrors={hasServiceErrors} />
        <Separator />
        <MetadataSection form={form} hasErrors={hasMetadataErrors} />
        <Separator />
        <ImplementationsSection form={form} hasErrors={hasImplementationsErrors} />
        <Separator />
        <SignatureSection />

        <Button type="submit" className="w-full" disabled={isGenerating || hasErrors}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : hasErrors ? (
            "Complete required sections to generate"
          ) : (
            "Generate AID Files"
          )}
        </Button>
      </form>
    </Form>
  )
}
