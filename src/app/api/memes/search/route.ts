import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Extract search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build search conditions
    const searchConditions = {
      OR: [
        { prompt: { contains: query, mode: 'insensitive' } },
        { style: { contains: query, mode: 'insensitive' } }
      ]
    };

    // Fetch memes
    const memes = await prisma.meme.findMany({
      where: searchConditions,
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        style: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Count total memes
    const totalMemes = await prisma.meme.count({ where: searchConditions });

    // Return paginated results
    return NextResponse.json({
      memes: memes.map(meme => meme.imageUrl), // Return only image URLs for onboarding
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMemes / limit),
        totalMemes,
        limit
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Meme search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search memes', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Ensure the route can handle OPTIONS preflight requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
