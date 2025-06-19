"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Zap } from "lucide-react"
import { toast } from "sonner"

interface OutputPanelProps {
  output: {
    manifest: string
    txt: string
    digCommand: string
    curlCommand: string
  } | null
  domain: string
  errorCount: number
}

export function OutputPanel({ output, domain, errorCount }: OutputPanelProps) {
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
      downloadFile(output.txt, "aid.txt", "text/plain")
    }, 100)
  }

  if (!output) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground p-6">
        <div className="text-center">
          <p className="mb-2">Start typing to see your output</p>
          <p className="text-sm">Updates automatically as you type!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <Badge variant="destructive" className="text-sm flex items-center gap-1">
              ⚠ {errorCount} {errorCount > 1 ? "issues" : "issue"}
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Live Preview
          </Badge>
          <span className="text-xs text-muted-foreground">Updates automatically</span>
        </div>
        <Button onClick={downloadAll} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>

      <Tabs defaultValue="manifest" className="flex flex-col flex-1">
        <TabsList className="grid grid-cols-4 gap-2 mb-4">
          <TabsTrigger value="manifest">Manifest</TabsTrigger>
          <TabsTrigger value="dns">DNS Record</TabsTrigger>
          <TabsTrigger value="dig">dig Command</TabsTrigger>
          <TabsTrigger value="curl">curl Command</TabsTrigger>
        </TabsList>

        <TabsContent value="manifest" className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">aid.json</h3>
              <p className="text-sm text-muted-foreground">
                Place this file at {domain}/.well-known/aid.json
              </p>
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">DNS TXT Record</h3>
              <p className="text-sm text-muted-foreground">Add this TXT record to your DNS zone</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.txt, "DNS TXT record")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadFile(output.txt, "aid.txt", "text/plain")}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono flex-1">
            <code>{output.txt}</code>
          </pre>
        </TabsContent>

        <TabsContent value="dig" className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Test DNS Record</h3>
              <p className="text-sm text-muted-foreground">Use this command to verify your DNS record is live</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.digCommand, "dig command")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono flex-1">
            <code>{output.digCommand}</code>
          </pre>
        </TabsContent>

        <TabsContent value="curl" className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Test Manifest</h3>
              <p className="text-sm text-muted-foreground">Use this command to verify your manifest is accessible</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output.curlCommand, "curl command")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono flex-1">
            <code>{output.curlCommand}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}
