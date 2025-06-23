"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core/browser"
import { BasicInfoSection } from "./form-sections/implementation-parts/basic-info-section"
import { TagsSection } from "./form-sections/implementation-parts/tags-section"
import { LocalPackageSection } from "./form-sections/implementation-parts/local-package-section"
import { AuthenticationSection } from "./form-sections/implementation-parts/authentication-section"
import { ConfigVariablesSection } from "./form-sections/implementation-parts/config-variables-section"

interface ImplementationFormProps {
  index: number
}

export function ImplementationForm({ index }: ImplementationFormProps) {
  const { control, watch } = useFormContext<AidGeneratorConfig>()
  const implementationType = watch(`implementations.${index}.type`)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <BasicInfoSection index={index} />
        <TagsSection index={index} />
        <Separator />

        {implementationType === "remote" && (
          <FormField
            control={control}
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
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <UrlInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="api.example.com/v1"
                    autoHttps={false}
                  />
                </FormControl>
                <FormDescription>HTTPS endpoint for your remote service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {implementationType === "local" && (
          <LocalPackageSection index={index} />
        )}

        <Separator />
        <ConfigVariablesSection index={index} />
        <Separator />
        <AuthenticationSection index={index} />
      </div>
    </TooltipProvider>
  )
}
