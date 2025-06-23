"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { aidGeneratorConfigSchema, buildManifest, buildTxtRecord } from "@aid/core/browser"
import { Codeblock } from "@/components/resolver/Codeblock"
import { pruneEmpty } from "@/lib/prune"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { ShieldAlert, ShieldCheck, Terminal } from "lucide-react"
import type { ZodIssue } from "zod"
import { AidGeneratorConfig } from "@aid/core"

export function OutputPanel() {
  const { watch, getValues } = useFormContext<AidGeneratorConfig>()
  const [output, setOutput] = useState<{ manifest: string; txtRecord: string } | null>(null)
  const [issues, setIssues] = useState<ZodIssue[]>([])

  useEffect(() => {
    const updateOutput = (data: AidGeneratorConfig) => {
      // 1. Generate output from pruned data
      const cleanedValues = pruneEmpty(data)
      try {
        const manifest = buildManifest(cleanedValues)
        const txtRecord = buildTxtRecord(cleanedValues)
        setOutput({
          manifest: JSON.stringify(manifest, null, 2),
          txtRecord,
        })
      } catch (error) {
        setOutput(null)
      }

      // 2. Validate the original data to get issues
      const result = aidGeneratorConfigSchema.safeParse(data)
      if (!result.success) {
        setIssues(result.error.issues)
      } else {
        setIssues([])
      }
    }

    // Set initial state
    updateOutput(getValues())

    // Subscribe to subsequent changes
    const subscription = watch((value) => {
      updateOutput(value as AidGeneratorConfig)
    })

    // Unsubscribe on cleanup
    return () => subscription.unsubscribe()
  }, [watch, getValues])

  const isValid = issues.length === 0

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Live Output</CardTitle>
          {isValid ? (
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <ShieldCheck className="h-4 w-4" /> Valid
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-destructive">
              <ShieldAlert className="h-4 w-4" /> {issues.length} Issues
            </span>
          )}
        </div>
        <CardDescription>The generated manifest and DNS record will update in real-time as you edit the form.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        {/* Validation Issues Display */}
        {!isValid && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>The configuration has validation issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                {issues.map((issue, i) => (
                  <li key={i}>
                    <span className="font-semibold">{issue.path.join(".")}</span>: {issue.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Output Blocks */}
        {output ? (
          <div className="space-y-4">
            <Codeblock content={output.txtRecord} title="DNS TXT Record" />
            <Codeblock content={output.manifest} title="Manifest (aid.json)" />
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
            <p>Start filling the form to see output...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
