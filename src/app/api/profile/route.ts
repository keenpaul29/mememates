import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log('Profile Update API Route Called');

  try {
    // Log incoming request details
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Authorization Header:', authHeader);
    
    if (!authHeader) {
      console.error('No authorization token provided');
      return NextResponse.json(
        { error: 'No authorization token provided' }, 
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    console.log('Token Extracted:', !!token);

    if (!token) {
      console.error('Invalid authorization format');
      return NextResponse.json(
        { error: 'Invalid authorization format' }, 
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'fallback_secret'
      ) as { id: string, email: string };
      console.log('Token Verified for User:', decoded.id);
    } catch (tokenError) {
      console.error('Token Verification Error:', tokenError);
      return NextResponse.json(
        { error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }

    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error('No user session found');
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Received Profile Data:', JSON.stringify(body, null, 2));

    // Validate input
    if (!body) {
      console.error('No profile data provided');
      return NextResponse.json(
        { error: 'Invalid input data' }, 
        { status: 400 }
      );
    }

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { 
        id: session.user.id 
      },
      data: {
        bio: body.bio || undefined,
        interests: body.interests 
          ? { set: body.interests } 
          : undefined,
        photos: body.photos 
          ? { set: body.photos } 
          : undefined,
        preferences: body.preferences 
          ? JSON.stringify(body.preferences) 
          : undefined,
        anthem: body.anthem 
          ? JSON.stringify(body.anthem) 
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        interests: true,
        photos: true,
        preferences: true,
        anthem: true
      }
    });

    console.log('Profile Updated Successfully:', JSON.stringify(updatedProfile, null, 2));

    return NextResponse.json(updatedProfile, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Comprehensive Profile Update Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      fullError: JSON.stringify(error)
    });

    return NextResponse.json(
      { 
        error: 'Failed to update profile', 
        details: error instanceof Error 
          ? error.message 
          : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
