"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { AidGeneratorConfig } from "@aid/core"
import { ImplementationForm } from "@/components/implementation-form"
import { cn } from "@/lib/utils"

interface ImplementationsSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  hasErrors: boolean
}

export function ImplementationsSection({ form, hasErrors }: ImplementationsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "implementations",
  })

  const [openAccordions, setOpenAccordions] = useState<string[]>([])

  const addRemoteImplementation = () => {
    const newIndex = fields.length
    append({
      type: "remote",
      name: "",
      protocol: "mcp",
      uri: "",
      tags: [], // Initialize as empty array
      authentication: { scheme: "none" },
      configuration: [], // Initialize as empty array
      requiredPaths: [], // Initialize as empty array
    })
    // Add the new accordion item to open items
    setOpenAccordions((prev) => [...prev, `item-${newIndex}`])
  }

  const addLocalImplementation = () => {
    const newIndex = fields.length
    append({
      type: "local",
      name: "",
      protocol: "mcp",
      package: {
        manager: "npx",
        identifier: "",
        digest: "", // Initialize as empty string
      },
      execution: {
        command: "npx",
        args: [], // Initialize as empty array
      },
      tags: [], // Initialize as empty array
      authentication: { scheme: "none" },
      configuration: [], // Initialize as empty array
      requiredPaths: [], // Initialize as empty array
    })
    // Add the new accordion item to open items
    setOpenAccordions((prev) => [...prev, `item-${newIndex}`])
  }

  const toggleAccordion = (value: string) => {
    setOpenAccordions((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("text-lg font-semibold", hasErrors && "text-destructive")}>Implementations</h3>
          <p className="text-sm text-muted-foreground">
            Define how clients can connect to your service (at least one required)
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addRemoteImplementation}>
            <Plus className="mr-2 h-4 w-4" />
            Remote
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addLocalImplementation}>
            <Plus className="mr-2 h-4 w-4" />
            Local
          </Button>
        </div>
      </div>

      <div className="pl-4 border-l-2 border-muted">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No implementations defined yet.</p>
            <p className="text-sm">Add a remote or local implementation to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-2 border-dashed border-muted-foreground/20">
                <CardHeader className="pb-3 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      remove(index)
                      setOpenAccordions((prev) => prev.filter((item) => item !== `item-${index}`))
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="pr-8">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">
                        {form.watch(`implementations.${index}.name`) || `Implementation ${index + 1}`}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAccordion(`item-${index}`)}
                      >
                        {openAccordions.includes(`item-${index}`) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">
                        {form.watch(`implementations.${index}.type`)}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        {form.watch(`implementations.${index}.protocol`)}
                      </span>
                      {form.watch(`implementations.${index}.type`) === "local" &&
                        form.watch(`implementations.${index}.package.manager`) && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {form.watch(`implementations.${index}.package.manager`)}
                          </span>
                        )}
                      {form.watch(`implementations.${index}.authentication.scheme`) && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          {form.watch(`implementations.${index}.authentication.scheme`)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {openAccordions.includes(`item-${index}`) && (
                  <CardContent>
                    <ImplementationForm form={form} index={index} />
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
