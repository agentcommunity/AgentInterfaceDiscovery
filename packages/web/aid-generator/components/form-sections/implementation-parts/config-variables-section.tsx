"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AidGeneratorConfig } from "@aid/core"
import { CollapsibleList } from "./collapsible-list"

interface ConfigVariablesSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function ConfigVariablesSection({ form, index }: ConfigVariablesSectionProps) {
  const currentConfig = form.watch(`implementations.${index}.configuration`) || []

  const addConfigItem = () => {
    const currentConfig = form.getValues(`implementations.${index}.configuration`) || []
    form.setValue(`implementations.${index}.configuration`, [
      ...currentConfig,
      {
        key: "",
        description: "",
        type: "string" as const,
        defaultValue: "",
        secret: false,
      },
    ])
  }

  const removeConfigItem = (configIndex: number) => {
    const currentConfig = form.getValues(`implementations.${index}.configuration`) || []
    form.setValue(
      `implementations.${index}.configuration`,
      currentConfig.filter((_, i) => i !== configIndex),
    )
  }

  const duplicateConfigItem = (configIndex: number) => {
    const currentConfig = form.getValues(`implementations.${index}.configuration`) || []
    const itemToDuplicate = currentConfig[configIndex]
    form.setValue(`implementations.${index}.configuration`, [
      ...currentConfig,
      { ...itemToDuplicate, key: `${itemToDuplicate.key}_copy` },
    ])
  }

  const clearAllConfigItems = () => {
    form.setValue(`implementations.${index}.configuration`, [])
  }

  const renderConfigItem = (configIndex: number) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`implementations.${index}.configuration.${configIndex}.key`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="READ_ONLY_MODE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`implementations.${index}.configuration.${configIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`implementations.${index}.configuration.${configIndex}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Enable read-only mode" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`implementations.${index}.configuration.${configIndex}.defaultValue`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Input 
                  placeholder="false" 
                  {...field} 
                  value={field.value?.toString() || ""} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`implementations.${index}.configuration.${configIndex}.secret`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
              <FormLabel>Secret</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as secret to handle the value securely</p>
                </TooltipContent>
              </Tooltip>
            </FormItem>
          )}
        />
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      <CollapsibleList
        title="Configuration Variables"
        description="Define variables that can be configured by users"
        addButtonText="Add Configuration Variable"
        itemTitle={(index) => {
          const item = currentConfig[index]
          return item?.key || `Variable ${index + 1}`
        }}
        itemCount={currentConfig.length}
        onAdd={addConfigItem}
        onRemove={removeConfigItem}
        onDuplicate={duplicateConfigItem}
        onClearAll={clearAllConfigItems}
        renderItem={renderConfigItem}
      >
        {null}
      </CollapsibleList>
    </TooltipProvider>
  )
} 