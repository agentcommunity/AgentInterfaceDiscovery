"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, FileText, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { AidGeneratorConfig } from "@aid/core"

interface SampleInfo {
  name: string;
  path: string;
  category: string;
}

interface SampleLoaderProps {
  onLoadSample: (config: AidGeneratorConfig) => void
}

export function SampleLoader({ onLoadSample }: SampleLoaderProps) {
  const [samples, setSamples] = useState<SampleInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSampleIndex = async () => {
      try {
        const response = await fetch(`/samples/index.json`)
        if (!response.ok) {
          throw new Error(`Failed to load samples index`)
        }
        const data: SampleInfo[] = await response.json()
        setSamples(data)
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error("Failed to load samples", { description: errorMessage })
        console.error("Error fetching sample index:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSampleIndex()
  }, []) // Empty dependency array ensures this runs only once on mount

  const handleSelectSample = async (samplePath: string) => {
    try {
      const response = await fetch(`/samples/${samplePath}`)
      if (!response.ok) throw new Error(`Failed to fetch ${samplePath}`)
      const config = await response.json()
      onLoadSample(config)
      toast.success("Sample loaded!")
    } catch (e) {
       const errorMessage = e instanceof Error ? e.message : "An unknown error occurred"
       toast.error("Failed to load sample", { description: errorMessage })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading && !error}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : error ? (
            <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Load Sample
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuLabel>Loading...</DropdownMenuLabel>
        ) : error ? (
          <DropdownMenuLabel className="text-destructive">{error}</DropdownMenuLabel>
        ) : (
          <>
            <DropdownMenuLabel>Select a sample to load</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(() => {
              const elements: React.ReactNode[] = [];
              let lastCategory: string | null = null;
              samples.forEach((sample) => {
                if (sample.category !== lastCategory) {
                  if (elements.length > 0) {
                    elements.push(<DropdownMenuSeparator key={`sep-${sample.category}`} />);
                  }
                  elements.push(
                    <DropdownMenuLabel key={sample.category} className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                      {sample.category}
                    </DropdownMenuLabel>
                  );
                  lastCategory = sample.category;
                }
                elements.push(
                  <DropdownMenuItem key={sample.path} onClick={() => handleSelectSample(sample.path)}>
                    {sample.name}
                  </DropdownMenuItem>
                );
              });
              return elements;
            })()}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
