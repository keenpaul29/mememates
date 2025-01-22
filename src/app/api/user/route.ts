import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' }, 
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid authorization format' }, 
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id: string, email: string };

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        interests: true,
        photos: true,
        preferences: true,
        anthem: true,
        image: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(user, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('User Retrieval Error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to retrieve user', 
        details: error instanceof Error 
          ? error.message 
          : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
