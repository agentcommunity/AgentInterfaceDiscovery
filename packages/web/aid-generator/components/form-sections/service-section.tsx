"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core"
import { cn } from "@/lib/utils"

export function ServiceSection() {
  const { control, formState: { errors } } = useFormContext<AidGeneratorConfig>()
  const hasErrors = !!errors.serviceName || !!errors.domain

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("text-lg font-semibold", hasErrors && "text-destructive")}>Service Details</h3>
          <p className="text-sm text-muted-foreground">The core identity of your agent service</p>
        </div>
        <Badge variant="outline">Schema v1</Badge>
      </div>

      <div className="space-y-4 pl-4 border-l-2 border-muted">
        <FormField
          control={control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Service Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Service" {...field} />
              </FormControl>
              <FormDescription>Human-readable name for your service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Domain
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <UrlInput
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  placeholder="example.com"
                  autoHttps={false}
                  stripProtocol={true}
                />
              </FormControl>
              <FormDescription>
                Primary domain where your service is hosted (without protocol preferred)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Schema Version</span>
          <Badge variant="secondary">1</Badge>
          <span className="text-sm text-muted-foreground">(fixed)</span>
        </div>
      </div>
    </div>
  )
}
