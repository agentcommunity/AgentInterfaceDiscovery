"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AidGeneratorConfig } from "@aid/core/browser"
import { CollapsibleList } from "./collapsible-list"

interface ConfigVariablesSectionProps {
  index: number
}

export function ConfigVariablesSection({ index }: ConfigVariablesSectionProps) {
  const { watch, getValues, setValue, control } = useFormContext<AidGeneratorConfig>()
  const currentConfig = watch(`implementations.${index}.configuration`) || []

  const addConfigItem = () => {
    const current = getValues(`implementations.${index}.configuration`) || []
    setValue(`implementations.${index}.configuration`, [
      ...current,
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
    const current = getValues(`implementations.${index}.configuration`) || []
    setValue(
      `implementations.${index}.configuration`,
      current.filter((_, i) => i !== configIndex),
    )
  }

  const duplicateConfigItem = (configIndex: number) => {
    const current = getValues(`implementations.${index}.configuration`) || []
    const itemToDuplicate = current[configIndex]
    setValue(`implementations.${index}.configuration`, [
      ...current,
      { ...itemToDuplicate, key: `${itemToDuplicate.key}_copy` },
    ])
  }

  const clearAllConfigItems = () => {
    setValue(`implementations.${index}.configuration`, [])
  }

  const renderConfigItem = (configIndex: number) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
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

      <div className="grid grid-cols-2 gap-4 items-center">
        <FormField
          control={control}
          name={`implementations.${index}.configuration.${configIndex}.defaultValue`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Input placeholder="false" {...field} value={field.value?.toString() || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`implementations.${index}.configuration.${configIndex}.secret`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 pt-8">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id={`secret-${index}-${configIndex}`} />
              </FormControl>
              <FormLabel htmlFor={`secret-${index}-${configIndex}`} className="flex items-center gap-2">
                Secret
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as secret to handle the value securely in client UIs</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
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
        description="Define variables for users to configure (e.g., API keys, flags)"
        addButtonText="Add Variable"
        itemTitle={configIndex => {
          const item = currentConfig[configIndex]
          return item?.key || `Variable ${configIndex + 1}`
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