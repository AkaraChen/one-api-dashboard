import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function PUT(request: NextRequest) {
  return handleProxy(request);
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request);
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request);
}

export async function HEAD(request: NextRequest) {
  return handleProxy(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  try {
    // Get the original URL from the header
    const originalUrl = request.headers.get('original-url');
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Missing ORIGINAL_URL header' },
        { status: 400 }
      );
    }

    // Clone the request headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip the original-url header and any host-related headers
      if (key !== 'original-url' && key !== 'host' && key !== 'referer') {
        headers.set(key, value);
      }
    });

    // Create fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: headers,
      redirect: 'follow',
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Clone the request to get its body
      const clonedRequest = request.clone();
      try {
        const contentType = request.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          fetchOptions.body = JSON.stringify(await clonedRequest.json());
        } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          fetchOptions.body = await clonedRequest.text();
        } else {
          fetchOptions.body = await clonedRequest.arrayBuffer();
        }
      } catch (error) {
        console.error('Error processing request body:', error);
      }
    }

    // Fetch the original URL
    const response = await fetch(originalUrl, fetchOptions);
    
    // Clone the response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // Add CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    
    // Create the response
    const responseData = await response.arrayBuffer();
    
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: (error as Error).message },
      { status: 500 }
    );
  }
}
