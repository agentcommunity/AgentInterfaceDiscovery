"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ArtefactSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ArtefactSelector({ value, onChange }: ArtefactSelectorProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className="flex items-center justify-center mb-6"
    >
      <TabsList className="grid grid-cols-4 w-fit">
        <TabsTrigger value="manifest">Manifest</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
        <TabsTrigger value="txt">DNS&nbsp;TXT</TabsTrigger>
        <TabsTrigger value="pair">Pair</TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 