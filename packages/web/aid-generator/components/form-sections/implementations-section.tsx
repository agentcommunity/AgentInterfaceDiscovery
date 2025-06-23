"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { AidGeneratorConfig, ImplementationConfig } from "@aid/core/browser"
import { ImplementationForm } from "@/components/implementation-form"
import { cn } from "@/lib/utils"
import { CollapsibleList } from "./implementation-parts/collapsible-list"
import { PlusCircle } from "lucide-react"

// Default empty state for a new remote implementation.
const newRemoteImplementation: ImplementationConfig = {
  type: "remote",
  name: "New Remote API",
  protocol: "mcp",
  uri: "",
  tags: [],
  authentication: { scheme: "none" },
  configuration: [],
  requiredPaths: [],
  status: "active",
}

// Default empty state for a new local implementation.
const newLocalImplementation: ImplementationConfig = {
  type: "local",
  name: "New Local Tool",
  protocol: "mcp",
  package: {
    manager: "npx",
    identifier: "",
  },
  execution: {
    command: "npx",
    args: [],
  },
  tags: [],
  authentication: { scheme: "none" },
  configuration: [],
  requiredPaths: [],
  status: "active",
}

export function ImplementationsSection() {
  const { control, getValues, setValue } = useFormContext<AidGeneratorConfig>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "implementations",
  })

  const { formState: { errors } } = useFormContext()
  const hasErrors = !!errors.implementations

  const addRemote = () => append(newRemoteImplementation)
  const addLocal = () => append(newLocalImplementation)
  const duplicate = (index: number) => {
    const original = getValues(`implementations.${index}`)
    append({ ...original, name: `${original.name} (Copy)` })
  }
  const clearAll = () => setValue("implementations", [])

  const renderImplementation = (index: number) => (
    <ImplementationForm index={index} />
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Implementations</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                type: "remote",
                name: "",
                protocol: "mcp",
                uri: "",
                authentication: { scheme: "none" },
              })
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Remote
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                type: "local",
                name: "",
                protocol: "mcp",
                package: { manager: "npx", identifier: "" },
                execution: { command: "", args: [] },
                authentication: { scheme: "none" },
              })
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Local
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CollapsibleList
          title="Implementations"
          description="Manage all defined implementations below."
          addButtonText="Add Implementation"
          itemTitle={(index) => {
            const item = getValues(`implementations.${index}`)
            return item?.name || `Implementation ${index + 1}`
          }}
          itemCount={fields.length}
          onAdd={addRemote}
          onRemove={remove}
          onDuplicate={duplicate}
          onClearAll={clearAll}
          renderItem={renderImplementation}
        >
          {fields.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900">No implementations added</h3>
              <p className="mt-1 text-sm text-gray-500">
                Click "+ Remote" or "+ Local" to add one.
              </p>
            </div>
          )}
        </CollapsibleList>
      </CardContent>
    </Card>
  )
}
