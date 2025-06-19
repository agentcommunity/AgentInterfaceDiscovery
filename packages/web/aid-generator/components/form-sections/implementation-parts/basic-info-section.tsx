"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core"

interface BasicInfoSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function BasicInfoSection({ form, index }: BasicInfoSectionProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`implementations.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Name
                <span className="text-red-500">*</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Human-readable name for this implementation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: &apos;Production API&apos; or &apos;Auth0 MCP (run)&apos;
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="Auth0 MCP (run)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`implementations.${index}.protocol`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Protocol
                <span className="text-red-500">*</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Communication protocol used by this implementation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MCP = Model Context Protocol, A2A = Agent-to-Agent, None = Setup/utility commands
                    </p>
                  </TooltipContent>
                </Tooltip>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`implementations.${index}.status`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Status
                <span className="text-muted-foreground italic text-sm">(optional)</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark this implementation as active or deprecated</p>
                  </TooltipContent>
                </Tooltip>
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
        <FormField
          control={form.control}
          name={`implementations.${index}.revocationURL` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Revocation URL
                <span className="text-muted-foreground italic text-sm">(optional)</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overrides global revocation URL for this implementation</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <UrlInput
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  placeholder="example.com/status"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TooltipProvider>
  )
} 