"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CollapsibleListProps {
  title: string
  description: string
  addButtonText: string
  itemTitle: (index: number) => string
  itemCount: number
  onAdd: () => void
  onRemove: (index: number) => void
  onDuplicate: (index: number) => void
  onClearAll: () => void
  children: React.ReactNode
  renderItem: (index: number, isExpanded: boolean) => React.ReactNode
}

export function CollapsibleList({
  title,
  description,
  addButtonText,
  itemTitle,
  itemCount,
  onAdd,
  onRemove,
  onDuplicate,
  onClearAll,
  children,
  renderItem,
}: CollapsibleListProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]) // First item expanded by default
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const toggleAll = () => {
    setIsAllExpanded((prev) => !prev)
    setExpandedItems(prev => prev.length === itemCount ? [] : Array.from({ length: itemCount }, (_, i) => i))
  }

  if (itemCount === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="animate-pulse"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {itemCount > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAll}
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
          >
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
          {itemCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all {title.toLowerCase()}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all {itemCount} items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll}>
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleItem(index)}
              >
                {expandedItems.includes(index) ? (
                  <ChevronUp className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="mr-2 h-4 w-4" />
                )}
                {itemTitle(index)}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDuplicate(index)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {expandedItems.includes(index) && renderItem(index, true)}
          </div>
        ))}
      </div>

      {children}
    </div>
  )
} 