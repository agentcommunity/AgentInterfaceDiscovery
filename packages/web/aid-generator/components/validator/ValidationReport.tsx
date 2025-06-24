"use client"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Codeblock } from "@/components/resolver/Codeblock"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import { ValidationResult } from "@aid/conformance"

interface ValidationReportProps {
  result: ValidationResult | null
  content?: string
  title?: string
}

export function ValidationReport({ result, content, title }: ValidationReportProps) {
  if (!result) {
    return null
  }

  return (
    <div className="space-y-4 mt-6">
      {result.ok ? (
        <Alert variant="default" className="border-green-500 text-green-700">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <AlertTitle>Validation Passed</AlertTitle>
          <AlertDescription>
            The provided artifact is compliant with the AID specification.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Failed</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {result.errors?.map((err: { path?: (string | number)[]; message: string }, index) => (
                <li key={index}>
                  <strong className="font-mono">
                    {err.path?.join(".") || "Error"}
                  </strong>
                  : {err.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {content && (
        <Codeblock
          content={content}
          title={title || "Validated Content"}
        />
      )}
    </div>
  )
} 