import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return a simple, valid JSON response
    return NextResponse.json({
      status: 'success',
      message: 'JSON parsing test',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug JSON Test Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
