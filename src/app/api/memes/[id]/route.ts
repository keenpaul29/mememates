import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single meme by ID
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const memeId = params.id;

    // Fetch meme with detailed information
    const meme = await prisma.meme.findUnique({
      where: { id: memeId },
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        mood: true,
        style: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reactions: {
          select: {
            type: true,
            count: true
          }
        }
      }
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(meme);
  } catch (error) {
    console.error('Meme retrieval error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve meme', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// PATCH update a meme
export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from authentication (you'll need to implement auth middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const memeId = params.id;
    const body = await request.json();

    // Validate input
    const { prompt, mood, style } = body;
    if (!prompt && !mood && !style) {
      return NextResponse.json(
        { error: 'No update data provided' }, 
        { status: 400 }
      );
    }

    // Update meme (with optional fields)
    const updatedMeme = await prisma.meme.update({
      where: { 
        id: memeId,
        creatorId: userId  // Ensure only the creator can update
      },
      data: {
        ...(prompt && { prompt }),
        ...(mood && { mood }),
        ...(style && { style })
      },
      select: {
        id: true,
        imageUrl: true,
        prompt: true,
        mood: true,
        style: true
      }
    });

    return NextResponse.json(updatedMeme);
  } catch (error) {
    console.error('Meme update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update meme', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// DELETE a meme
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from authentication (you'll need to implement auth middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const memeId = params.id;

    // Delete meme (only if the user is the creator)
    await prisma.meme.delete({
      where: { 
        id: memeId,
        creatorId: userId 
      }
    });

    return NextResponse.json(
      { message: 'Meme deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Meme deletion error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete meme', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
