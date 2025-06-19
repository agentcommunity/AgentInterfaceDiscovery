"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AidGeneratorConfig } from "@aid/core"

interface TagsSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function TagsSection({ form, index }: TagsSectionProps) {
  const [newTag, setNewTag] = useState("")
  const currentTags = form.watch(`implementations.${index}.tags`) || []

  const addTag = () => {
    if (!newTag.trim()) return
    const currentTags = form.getValues(`implementations.${index}.tags`) || []
    form.setValue(`implementations.${index}.tags`, [...currentTags, newTag.trim()])
    setNewTag("")
  }

  const removeTag = (tagIndex: number) => {
    const currentTags = form.getValues(`implementations.${index}.tags`) || []
    form.setValue(
      `implementations.${index}.tags`,
      currentTags.filter((_, i) => i !== tagIndex),
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Optional labels to categorize this implementation</p>
              <p className="text-xs text-muted-foreground mt-1">Examples: &apos;local&apos;, &apos;tools&apos;, &apos;setup&apos;, &apos;production&apos;</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-3 pl-6 border-l-2 border-muted">
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tagIndex)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="local, tools, setup..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
} 