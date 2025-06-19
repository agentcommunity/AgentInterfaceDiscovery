import { type NextRequest, NextResponse } from "next/server"
import { buildManifest, buildTxtRecord } from "@aid/core"
import { aidGeneratorConfigSchema } from "@/lib/schemas"
import type { AidGeneratorConfig } from "@aid/core"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json()
    const config = aidGeneratorConfigSchema.parse(body) as AidGeneratorConfig

    // Generate the manifest and TXT record
    const manifest = buildManifest(config)
    const manifestJson = JSON.stringify(manifest, null, 2)
    const txtRecord = buildTxtRecord(config)

    return NextResponse.json({
      manifest: manifestJson,
      txt: txtRecord,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation error
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 422 },
      )
    }

    console.error("Generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
