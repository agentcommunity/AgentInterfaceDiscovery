"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core"
import { cn } from "@/lib/utils"

interface MetadataSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  hasErrors: boolean
}

export function MetadataSection({ form, hasErrors }: MetadataSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className={cn("text-lg font-semibold", hasErrors && "text-destructive")}>Metadata</h3>
        <p className="text-sm text-muted-foreground">Optional metadata about your service</p>
      </div>

      <div className="space-y-4 pl-4 border-l-2 border-muted">
        <FormField
          control={form.control}
          name="metadata.contentVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Content Version
                <span className="text-muted-foreground italic text-sm">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="2024-01-15 (auto-generated if empty)" {...field} />
              </FormControl>
              <FormDescription>Version of your configuration (YYYY-MM-DD format recommended)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.documentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Documentation URL
                <span className="text-muted-foreground italic text-sm">(optional)</span>
              </FormLabel>
              <FormControl>
                <UrlInput value={field.value} onChange={field.onChange} placeholder="example.com/docs" />
              </FormControl>
              <FormDescription>Link to your service documentation</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata.revocationURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Revocation URL
                <span className="text-muted-foreground italic text-sm">(optional)</span>
              </FormLabel>
              <FormControl>
                {/* Ensure the value passed to the input is always a string */}
                <UrlInput
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  placeholder="example.com/revoke"
                />
              </FormControl>
              <FormDescription>URL for revoking access or reporting issues</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
