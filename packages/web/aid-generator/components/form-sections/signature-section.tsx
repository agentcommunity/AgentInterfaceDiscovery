"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export function SignatureSection() {
  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 bg-transparent shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          <div>
            <CardTitle>Signature (Coming Soon)</CardTitle>
            <CardDescription>Digitally sign your manifest to prove ownership and prevent tampering.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Signatures will be implemented in a future version of the specification. This section is a placeholder to show where that functionality will live.
        </p>
      </CardContent>
    </Card>
  )
}
