"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type AidGeneratorConfig } from "@aid/core/browser"

interface Sample {
  name: string
  file: string
}

export function SampleLoader() {
  const [samples, setSamples] = useState<Sample[]>([])
  const { reset } = useFormContext<AidGeneratorConfig>()

  useEffect(() => {
    async function fetchSamples() {
      try {
        const response = await fetch("/samples/index.json")
        const sampleIndex: Sample[] = await response.json()
        setSamples(sampleIndex)
      } catch (error) {
        console.error("Failed to load sample index:", error)
      }
    }
    fetchSamples()
  }, [])

  const handleLoadSample = async (file: string) => {
    if (!file) return
    try {
      const response = await fetch(`/samples/${file}`)
      const config: AidGeneratorConfig = await response.json()
      // Directly reset the form with the raw config from the sample file.
      // The form provider's default values will handle merging/filling any missing fields.
      reset(config)
    } catch (error) {
      console.error(`Failed to load sample file ${file}:`, error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Load Sample</span>
      <Select onValueChange={handleLoadSample}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a sample..." />
        </SelectTrigger>
        <SelectContent>
          {samples.map((sample) => (
            <SelectItem key={sample.file} value={sample.file}>
              {sample.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
