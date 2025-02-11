// app/api/status/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the CSV file
    const filePath = path.join(process.cwd(), 'public/data/status.csv');
    
    // Read the file
    const csvData = await fs.readFile(filePath, 'utf8');
    
    // Clean and validate the CSV data
    const cleanedData = csvData
      .trim()
      .split('\n')
      .filter(line => line.length > 0 && !line.startsWith('#')); // Skip comments and empty lines
    
    return new NextResponse(cleanedData.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load status data' }, 
      { status: 500 }
    );
  }
}