"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AidGeneratorConfig } from "@agentcommunity/aid-core/browser"

interface PlacementSectionProps {
  index: number
}

export function PlacementSection({ index }: PlacementSectionProps) {
  const { control } = useFormContext<AidGeneratorConfig>()

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-muted">
      <h4 className="text-sm font-medium text-muted-foreground">Authentication Placement</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`implementations.${index}.authentication.placement.in`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>In</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="query">Query Parameter</SelectItem>
                  <SelectItem value="cli_arg">CLI Argument</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`implementations.${index}.authentication.placement.key`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="Authorization" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`implementations.${index}.authentication.placement.format`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Format</FormLabel>
            <FormControl>
              <Input placeholder="Bearer {token}" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>
              Use {"{token}"} as the placeholder for the secret. For Basic Auth, this is often handled by the client library and can be left blank.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 