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
  // For our special example domains, we bypass the network fetch and build the manifest
  // on-the-fly from the local generator config files in `/public/samples`.
  // This avoids the Vercel "hairpinning" issue while keeping the files where the UI expects them.
  if (exampleDomains.includes(urlHost)) {
    let domainName = urlHost.split('.')[0];
    // Special case for the root domain which maps to the landing-mcp example
    if (urlHost === 'agentcommunity.org') {
      domainName = 'landing-mcp';
    }
    
    // Next.js bundles the `public` directory, making it available at the root of the server.
    const filePath = path.join(process.cwd(), 'public/samples', `${domainName}.json`);

    try {
        console.log(`[PROXY] Building manifest for '${domainName}' from local config: ${filePath}`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const generatorConfig = JSON.parse(fileContent) as AidGeneratorConfig;
        
        // Convert the generator config to a published manifest on the fly
        const manifest = buildManifest(generatorConfig);
        
        return new NextResponse(JSON.stringify(manifest, null, 2), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`[PROXY] ERROR: Could not build manifest for '${domainName}' from local config.`, {
             path: filePath,
             error: error.message 
        });
        return NextResponse.json({ error: `Could not load or convert local sample file: ${error.message}` }, { status: 500 });
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