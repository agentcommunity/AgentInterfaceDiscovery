import { NextRequest, NextResponse } from 'next/server';

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