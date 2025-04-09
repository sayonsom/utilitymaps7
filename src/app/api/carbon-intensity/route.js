import { NextResponse } from 'next/server';

const BEARER_TOKEN = 'f0f29188-c004-43a0-8cb3-c31e8195ddd5';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const baseUrl = searchParams.get('baseUrl') || 'https://carbonaggr-ap04dapnortheast1-ext-1098454081.ap-northeast-1.elb.amazonaws.com';

  if (!region) {
    return NextResponse.json({ error: 'Region parameter is required' }, { status: 400 });
  }

  try {
    // Temporarily disable SSL verification for development
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const apiUrl = `${baseUrl}/v1/carbon-intensity/latest?zone=${region}`;
    console.log(`Making request to: ${apiUrl}`);
    console.log('Using bearer token:', BEARER_TOKEN);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store' // Disable caching
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data:', data);
    
    // Re-enable SSL verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Detailed error in carbon-intensity API route:', {
      message: error.message,
      stack: error.stack,
      region,
      baseUrl,
      requestHeaders: {
        Authorization: `Bearer ${BEARER_TOKEN.slice(0, 5)}...`, // Log partial token for debugging
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Re-enable SSL verification in case of error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    
    return NextResponse.json(
      { 
        error: error.message,
        details: error.stack
      }, 
      { status: error.status || 500 }
    );
  }
} 