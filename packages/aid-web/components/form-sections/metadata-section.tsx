"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@agentcommunity/aid-core"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export function MetadataSection() {
  const { control, formState: { errors } } = useFormContext<AidGeneratorConfig>()
  const hasErrors = !!errors.metadata

  return (
    <div className="space-y-4">
      <div>
        <h3 className={cn("text-lg font-semibold", hasErrors && "text-destructive")}>Metadata</h3>
        <p className="text-sm text-muted-foreground">Optional metadata about your service</p>
      </div>

      <div className="space-y-4 pl-4 border-l-2 border-muted">
        <FormField
          control={control}
          name="metadata.contentVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Content Version
                <span className="text-muted-foreground italic text-sm">(optional)</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>A version string for the manifest&apos;s content, used by clients for caching.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Best practice: update this whenever you change the manifest (e.g., with the current date).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="2025-06-25.1" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Version of your configuration (YYYY-MM-DD format recommended)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="metadata.documentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Documentation URL
                <span className="text-muted-foreground italic text-sm">(optional)</span>
              </FormLabel>
              <FormControl>
                <UrlInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="example.com/docs"
                  autoHttps={false}
                />
              </FormControl>
              <FormDescription>Link to your service documentation</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="metadata.revocationURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Revocation URL
                <span className="text-muted-foreground italic text-sm">(optional)</span>
              </FormLabel>
              <FormControl>
                <UrlInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="example.com/revoke"
                  autoHttps={false}
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
