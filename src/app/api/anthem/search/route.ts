import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Spotify API Authentication
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify credentials');
    throw new Error('Spotify credentials not configured');
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Spotify token error:', error);
    throw new Error('Failed to obtain Spotify access token');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract search query
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    console.log('Received search query:', query);

    if (!query) {
      console.error('No search query provided');
      return NextResponse.json(
        { error: 'Search query is required' }, 
        { status: 400 }
      );
    }

    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken();
    console.log('Obtained Spotify access token');

    // Search tracks on Spotify
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: query,
          type: 'track',
          limit: 10
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Spotify search response received');

    // Transform Spotify tracks to our format
    const tracks = searchResponse.data.tracks.items.map((track: any) => {
      // Validate and select the best album art
      const albumArt = track.album.images.length > 0 
        ? track.album.images.reduce((largest: any, image: any) => 
            (image.width > largest.width) ? image : largest
          )
        : null;

      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        albumArt: albumArt?.url || null,
        previewUrl: track.preview_url,
        externalUrl: track.external_urls.spotify
      };
    }).filter((track: any) => 
      // Additional filtering to ensure valid data
      track.albumArt && 
      track.albumArt.startsWith('https://i.scdn.co/image/')
    );

    console.log('Transformed tracks:', tracks.length);

    return NextResponse.json({ 
      tracks,
      total: searchResponse.data.tracks.total
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Comprehensive anthem search error:', error);
    
    // Detailed error logging
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to search songs', 
        details: error instanceof Error 
          ? error.message 
          : 'Unknown error',
        fullError: error instanceof Error 
          ? JSON.stringify(error) 
          : 'No additional error details'
      }, 
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
