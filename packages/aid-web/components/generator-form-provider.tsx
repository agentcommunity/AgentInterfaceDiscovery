"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider } from "react-hook-form"
import { aidGeneratorConfigSchema, type AidGeneratorConfig } from "@aid/core/browser"

// Default empty state for the form, matching the AidGeneratorConfig structure.
const emptyConfig: AidGeneratorConfig = {
  schemaVersion: "1",
  serviceName: "",
  domain: "",
  metadata: {
    contentVersion: "",
    documentation: "",
    revocationURL: "",
  },
  implementations: [],
}

interface GeneratorFormProviderProps {
  children: React.ReactNode
}

/**
 * Provides a central `react-hook-form` instance via context.
 * This is the core of the refactored architecture, eliminating prop-drilling.
 * It initializes the form with Zod-based validation and a default empty state.
 */
export function GeneratorFormProvider({ children }: GeneratorFormProviderProps) {
  const form = useForm<AidGeneratorConfig>({
    resolver: zodResolver(aidGeneratorConfigSchema),
    // Validate on blur for better UX, providing feedback when a user moves away from a field.
    mode: "onBlur",
    defaultValues: emptyConfig,
  })

  return <FormProvider {...form}>{children}</FormProvider>
} 