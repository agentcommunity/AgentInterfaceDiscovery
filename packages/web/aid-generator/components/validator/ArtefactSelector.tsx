"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ArtefactSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ArtefactSelector({ value, onChange }: ArtefactSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex items-center justify-center gap-4 mb-6"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="manifest" id="manifest" />
        <Label htmlFor="manifest">Manifest</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="config" id="config" />
        <Label htmlFor="config">Generator Config</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="txt" id="txt" />
        <Label htmlFor="txt">DNS TXT</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pair" id="pair" />
        <Label htmlFor="pair">Config + Manifest Pair</Label>
      </div>
    </RadioGroup>
  )
} 