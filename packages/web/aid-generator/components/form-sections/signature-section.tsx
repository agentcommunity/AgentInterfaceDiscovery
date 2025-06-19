"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function SignatureSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Signature</h3>
        <p className="text-sm text-muted-foreground">Digital signature for manifest verification</p>
      </div>

      <div className="pl-4 border-l-2 border-muted">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            JWS signature support is planned for a future release. For now, manifests are generated without signatures.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
