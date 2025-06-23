import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { buildManifest, AidGeneratorConfig } from '@aid/core';

// These are the special domains for our examples that rely on Vercel rewrites.
const exampleDomains = [
    'auth0.aid.agentcommunity.org',
    'edge-case.aid.agentcommunity.org',
    'landing-mcp.aid.agentcommunity.org',
    'mixed.aid.agentcommunity.org',
    'multi.aid.agentcommunity.org',
    'simple.aid.agentcommunity.org',
    'agentcommunity.org' // Added for the landing-mcp case
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const urlToProxy = searchParams.get('url');

  if (!urlToProxy) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  let url;
  try {
    url = new URL(urlToProxy);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
  }
  
  const urlHost = url.hostname;

  // --- Unified Example Handling (Works Locally & on Vercel) ---
  // For our special example domains, we bypass the network fetch.
  // This avoids issues with serverless functions fetching URLs that are part of the same deployment (hairpinning).
  // The `build-examples` script ensures the final, published manifests are available in the deployment package.
  if (exampleDomains.includes(urlHost)) {
      // The domain name (e.g., 'simple') corresponds to the directory in `packages/examples/public`.
      // The main domain `agentcommunity.org` maps to the `landing-mcp` example.
      const exampleName = urlHost === 'agentcommunity.org' ? 'landing-mcp' : urlHost.split('.')[0];
      
      // This path resolves to the built static manifest file within the project structure.
      // Vercel makes the monorepo's file structure available to the serverless function.
      const filePath = path.join(process.cwd(), 'packages/examples/public', exampleName, '.well-known/aid.json');

      try {
          console.log(`[PROXY] Serving known example '${exampleName}' from filesystem path: ${filePath}`);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          
          return new NextResponse(fileContent, {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
          });

      } catch (error: any) {
          console.error(`[PROXY] ERROR: Could not read manifest for '${exampleName}' from filesystem.`, { path: filePath, error: error.message });
          return NextResponse.json({ error: `Could not load manifest file for example domain: ${error.message}` }, { status: 500 });
      }
  }
  // --- End of unified example handling ---


  // Basic security measure: only proxy http and https protocols
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return NextResponse.json({ error: 'Only HTTP and HTTPS protocols are allowed' }, { status: 400 });
  }

  try {
    console.log(`[PROXY] Attempting to fetch: ${url.toString()}`);
    const response = await fetch(url.toString());

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PROXY] Error fetching from external URL: ${response.status} ${response.statusText}`, { details: errorText });
        return NextResponse.json({ error: `Failed to fetch from external URL: ${response.status} ${response.statusText}`, details: errorText }, { status: response.status });
    }
    
    // Stream the response back to the client
    const data = await response.text();
    console.log(`[PROXY] Successfully fetched and returning data from: ${url.toString()}`);
    return new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
        }
    });

  } catch (error: any) {
    console.error('[PROXY] CATCH BLOCK ERROR:', error);
    return NextResponse.json({ error: 'An internal error occurred while fetching the URL.', details: error.message || 'An unknown error occurred in the proxy.' }, { status: 500 });
  }
} 