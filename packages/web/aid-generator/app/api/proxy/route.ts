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
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/dns-json',
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: `Failed to fetch from external URL: ${response.status} ${response.statusText}`, details: errorText }, { status: response.status });
    }
    
    // Stream the response back to the client
    const data = await response.text();
    return new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
        }
    });

  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'An internal error occurred while fetching the URL.', details: error.message }, { status: 500 });
  }
} 