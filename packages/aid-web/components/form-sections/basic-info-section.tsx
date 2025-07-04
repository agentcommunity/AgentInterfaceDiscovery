"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UrlInput } from "@/components/ui/url-input"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function BasicInfoSection() {
  const { control } = useFormContext()
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Info</h3>
      <div className="space-y-4 pl-6 border-l-2 border-muted">
        <FormField
          control={control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Service Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Agent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Domain
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The domain where the <code>_agent</code> DNS TXT record will be published.
                      <br />
                      This is used to generate the correct DNS record preview.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <UrlInput
                  placeholder="example.com"
                  {...field}
                  value={field.value ?? ""}
                  autoHttps={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 