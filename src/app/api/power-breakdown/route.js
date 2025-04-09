import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone');
    const baseUrl = searchParams.get('baseUrl');
    
    if (!zone || !baseUrl) {
      return NextResponse.json({ error: 'Missing zone or baseUrl parameter' }, { status: 400 });
    }

    const BEARER_TOKEN = 'f0f29188-c004-43a0-8cb3-c31e8195ddd5';
    
    // In Next.js API routes, we can't use the https module directly
    // So we'll use a different approach with environment variables
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const response = await fetch(`${baseUrl}/v1/power-breakdown/latest?zone=${zone}`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API responded with status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in power-breakdown API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Reset the environment variable
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
  }
} 