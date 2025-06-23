"use client"

import { useFormContext } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { ServiceSection } from "@/components/form-sections/service-section"
import { MetadataSection } from "@/components/form-sections/metadata-section"
import { ImplementationsSection } from "@/components/form-sections/implementations-section"
import { SignatureSection } from "@/components/form-sections/signature-section"
import { Separator } from "@/components/ui/separator"

/**
 * The main container for all form sections.
 * It uses the FormProvider from react-hook-form to make the form instance
 * available to all nested components via context, eliminating prop-drilling.
 */
export function ConfigForm() {
  const form = useFormContext() // No props needed!

  return (
    <Form {...form}>
      <form className="space-y-8">
        <ServiceSection />
        <Separator />
        <MetadataSection />
        <Separator />
        <ImplementationsSection />
        <Separator />
        <SignatureSection />
      </form>
    </Form>
  )
}
