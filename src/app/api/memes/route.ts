import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all memes
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const mood = searchParams.get('mood') || undefined;
    const style = searchParams.get('style') || undefined;

    // Build dynamic filter
    const filter: any = {};
    if (mood) filter.mood = mood;
    if (style) filter.style = style;

    // Fetch memes with pagination and optional filtering
    const memes = await prisma.meme.findMany({
      where: filter,
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        mood: true,
        style: true,
        creator: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Count total memes
    const totalMemes = await prisma.meme.count({ where: filter });

    return NextResponse.json({
      memes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMemes / limit),
        totalMemes,
        limit
      }
    });
  } catch (error) {
    console.error('Meme retrieval error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve memes', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// POST create a new meme
export async function POST(request: NextRequest) {
  try {
    // Get user ID from authentication (you'll need to implement auth middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { imageUrl, prompt, mood, style } = body;

    // Validate input
    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Image URL and prompt are required' }, 
        { status: 400 }
      );
    }

    // Create meme
    const newMeme = await prisma.meme.create({
      data: {
        imageUrl,
        prompt,
        mood: mood || 'NEUTRAL',
        style: style || 'MEME',
        creatorId: userId
      },
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        mood: true,
        style: true
      }
    });

    return NextResponse.json(newMeme, { status: 201 });
  } catch (error) {
    console.error('Meme creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create meme', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
