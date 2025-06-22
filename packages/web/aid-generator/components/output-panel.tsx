"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

interface OutputPanelProps {
  output: {
    manifest: string
    txtRecord: string
  } | null
}

export function OutputPanel({ output }: OutputPanelProps) {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied!", {
        description: `${label} copied to clipboard`,
      })
    } catch {
      toast.error("Copy failed", {
        description: "Unable to copy to clipboard",
      })
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Downloaded!", {
      description: `${filename} has been downloaded`,
    })
  }

  const downloadAll = () => {
    if (!output) return
    downloadFile(output.manifest, "aid.json", "application/json")
    setTimeout(() => {
      downloadFile(output.txtRecord, "aid.txt", "text/plain")
    }, 100)
  }

  if (!output) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground p-6 border rounded-lg bg-card shadow-sm">
        <div className="text-center">
          <Zap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">Output Panel</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generated files will appear here once you start typing.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center pb-3">
        <Button onClick={downloadAll} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>

      <Tabs defaultValue="manifest" className="flex flex-col flex-1">
        <TabsList className="grid grid-cols-2 gap-2 mb-4">
          <TabsTrigger value="manifest">Manifest (aid.json)</TabsTrigger>
          <TabsTrigger value="dns">DNS Record (aid.txt)</TabsTrigger>
        </TabsList>

        <TabsContent value="manifest" className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.manifest, "Manifest JSON")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadFile(output.manifest, "aid.json", "application/json")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono flex-1">
            <code>{output.manifest}</code>
          </pre>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.txtRecord, "DNS TXT record")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadFile(output.txtRecord, "aid.txt", "text/plain")}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono flex-1">
            <code>{output.txtRecord}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}
