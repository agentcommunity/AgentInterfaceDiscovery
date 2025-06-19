"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AidGeneratorConfig } from "@aid/core"

interface PlacementSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function PlacementSection({ form, index }: PlacementSectionProps) {
  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-muted">
      <h4 className="text-sm font-medium text-muted-foreground">Authentication Placement</h4>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
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
          control={form.control}
          name={`implementations.${index}.authentication.placement.key`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="Authorization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`implementations.${index}.authentication.placement.format`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Format</FormLabel>
            <FormControl>
              <Input placeholder="Bearer {token}" {...field} />
            </FormControl>
            <FormDescription>
              Use {"{token}"} as the placeholder for the secret.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 