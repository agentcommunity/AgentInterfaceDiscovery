"use client"

import { useState, useEffect } from "react"
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

// Define the samples to be loaded from the public directory
const sampleFiles = [
  { name: "Hello World", path: "hello-world.json" },
  { name: "Auth0 MCP", path: "auth0-mcp.json" },
  { name: "Mixed Profile", path: "mixed-profile.json" },
]

interface SampleLoaderProps {
  onLoadSample: (config: AidGeneratorConfig) => void
}

export function SampleLoader({ onLoadSample }: SampleLoaderProps) {
  const [samples, setSamples] = useState<Record<string, AidGeneratorConfig>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const loadedSamples: Record<string, AidGeneratorConfig> = {}
        for (const file of sampleFiles) {
          const response = await fetch(`/samples/${file.path}`)
          if (!response.ok) {
            throw new Error(`Failed to load ${file.name}`)
          }
          const data: AidGeneratorConfig = await response.json()
          loadedSamples[file.name] = data
        }
        setSamples(loadedSamples)
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error("Failed to load samples", { description: errorMessage })
        console.error("Error fetching samples:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSamples()
  }, []) // Empty dependency array ensures this runs only once on mount

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
            {Object.entries(samples).map(([name, config]) => (
              <DropdownMenuItem key={name} onClick={() => onLoadSample(config)}>
                {name}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
