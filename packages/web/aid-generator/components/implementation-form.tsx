"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core"
import { BasicInfoSection } from "./form-sections/implementation-parts/basic-info-section"
import { TagsSection } from "./form-sections/implementation-parts/tags-section"
import { LocalPackageSection } from "./form-sections/implementation-parts/local-package-section"
import { AuthenticationSection } from "./form-sections/implementation-parts/authentication-section"
import { ConfigVariablesSection } from "./form-sections/implementation-parts/config-variables-section"

interface ImplementationFormProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function ImplementationForm({ form, index }: ImplementationFormProps) {
  const implementationType = form.watch(`implementations.${index}.type`)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Basic Information */}
        <BasicInfoSection form={form} index={index} />

        {/* Tags */}
        <TagsSection form={form} index={index} />

        <Separator />

        {/* Type-specific fields */}
        {implementationType === "remote" && (
          <FormField
            control={form.control}
            name={`implementations.${index}.uri`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  URI
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>HTTPS endpoint where your remote service is accessible</p>
                      <p className="text-xs text-muted-foreground mt-1">Example: api.example.com/v1</p>
                      <p className="text-xs text-muted-foreground">https:// will be added automatically</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <UrlInput value={field.value} onChange={field.onChange} placeholder="api.example.com/v1" />
                </FormControl>
                <FormDescription>HTTPS endpoint for your remote service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {implementationType === "local" && (
          <LocalPackageSection form={form} index={index} />
        )}

        <Separator />

        {/* Configuration Variables */}
        <ConfigVariablesSection form={form} index={index} />

        <Separator />

        {/* Authentication */}
        <AuthenticationSection form={form} index={index} />
      </div>
    </TooltipProvider>
  )
}
