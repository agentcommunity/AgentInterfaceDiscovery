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
  hasServiceErrors: boolean
  hasMetadataErrors: boolean
  hasImplementationsErrors: boolean
}

export function ConfigForm({
  form,
  hasServiceErrors,
  hasMetadataErrors,
  hasImplementationsErrors,
}: ConfigFormProps) {
  const { formState } = form
  const hasErrors = !formState.isValid

  return (
    <Form {...form}>
      <form className="space-y-8">
        <ServiceSection form={form} hasErrors={hasServiceErrors} />
        <Separator />
        <MetadataSection form={form} hasErrors={hasMetadataErrors} />
        <Separator />
        <ImplementationsSection form={form} hasErrors={hasImplementationsErrors} />
        <Separator />
        <SignatureSection />
      </form>
    </Form>
  )
}
