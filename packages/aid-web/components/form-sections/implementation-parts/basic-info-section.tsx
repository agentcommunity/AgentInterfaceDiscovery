"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@agentcommunity/aid-core/browser"
import { TagsSection } from "./tags-section"
import { Checkbox } from "@/components/ui/checkbox"

interface BasicInfoSectionProps {
  index: number
}

export function BasicInfoSection({ index }: BasicInfoSectionProps) {
  const { control } = useFormContext<AidGeneratorConfig>()

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`implementations.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Implementation Name
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>A short, machine-readable ID, unique within the manifest.</p>
                      <p className="text-xs text-muted-foreground mt-1">Example: &apos;cloud-prod-v1&apos;. No spaces allowed.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input placeholder="cloud-prod-v1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`implementations.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Implementation Title
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>A human-readable name displayed to the user in client applications.</p>
                      <p className="text-xs text-muted-foreground mt-1">Example: &apos;Cloud API (Production)&apos;</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Cloud API (Production)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Protocol */}
          <FormField
            control={control}
            name={`implementations.${index}.protocol`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Protocol <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mcp">MCP</SelectItem>
                    <SelectItem value="a2a">A2A</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MCP Version */}
          <FormField
            control={control}
            name={`implementations.${index}.mcpVersion`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  MCP Version <span className="text-sm italic text-muted-foreground">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>A non-binding hint of the MCP version supported.</p>
                      <p className="mt-1 text-xs text-muted-foreground">Example: &apos;2025-06-18&apos;</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input placeholder="2025-06-18" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Capabilities */}
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            Capabilities <span className="text-sm italic text-muted-foreground">(optional)</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>A hint about supported MCP capabilities.</p>
              </TooltipContent>
            </Tooltip>
          </FormLabel>
          <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
            <FormField
              control={control}
              name={`implementations.${index}.capabilities.structuredOutput`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={(checked) => field.onChange(checked ? {} : undefined)} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Structured Output</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`implementations.${index}.capabilities.resourceLinks`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={(checked) => field.onChange(checked ? {} : undefined)} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Resource Links</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <FormField
            control={control}
            name={`implementations.${index}.status`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Status <span className="text-sm italic text-muted-foreground">(optional)</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="active">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Revocation URL */}
          <FormField
            control={control}
            name={`implementations.${index}.revocationURL`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Revocation URL <span className="text-sm italic text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <UrlInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="example.com/status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </TooltipProvider>
  )
} 