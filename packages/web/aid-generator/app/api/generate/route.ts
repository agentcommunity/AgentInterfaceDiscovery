import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { aidGeneratorConfigSchema, buildManifest, buildTxtRecord } from '@aid/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = aidGeneratorConfigSchema.parse(body);

    const manifest = buildManifest(config);
    const txtRecord = buildTxtRecord(config);

    return NextResponse.json({
      manifest: JSON.stringify(manifest, null, 2),
      txtRecord: txtRecord,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
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
