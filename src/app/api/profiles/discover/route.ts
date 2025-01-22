import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for demonstration
const mockProfiles = [
  {
    id: '1',
    name: 'Sarah Parker',
    age: 24,
    bio: 'Meme queen 👑 | Music lover 🎵 | Always looking for the next viral trend',
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '1',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=400&fit=crop',
        caption: 'When the code finally works'
      },
      {
        id: '2',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&h=400&fit=crop',
        caption: 'Weekend vibes'
      }
    ],
    anthem: {
      id: '1',
      name: 'Dreams',
      artist: 'Fleetwood Mac',
      albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/1'
    },
    distance: 5,
    interests: ['memes', 'music', 'photography']
  },
  {
    id: '2',
    name: 'Alex Thompson',
    age: 27,
    bio: 'Professional meme curator 🎭 | Vinyl collector | Coffee enthusiast ☕',
    photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '3',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?w=400&h=400&fit=crop',
        caption: 'Monday meetings be like'
      },
      {
        id: '4',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        caption: 'Gaming night'
      }
    ],
    anthem: {
      id: '2',
      name: 'Bohemian Rhapsody',
      artist: 'Queen',
      albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/2'
    },
    distance: 3,
    interests: ['gaming', 'music', 'coffee']
  },
  {
    id: '3',
    name: 'Jordan Lee',
    age: 25,
    bio: 'Making memes & memories ✨ | Music producer | Gamer 🎮',
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '5',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        caption: 'Studio life'
      },
      {
        id: '6',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        caption: 'Weekend plans'
      }
    ],
    anthem: {
      id: '3',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/3'
    },
    distance: 7,
    interests: ['music production', 'gaming', 'memes']
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    age: 23,
    bio: 'Anime enthusiast 🎌 | Digital artist 🎨 | Meme connoisseur',
    photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '7',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=400&fit=crop',
        caption: 'Art life struggles'
      },
      {
        id: '8',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop',
        caption: 'Anime marathon mode'
      }
    ],
    anthem: {
      id: '4',
      name: 'Gurenge',
      artist: 'LiSA',
      albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/4'
    },
    distance: 2,
    interests: ['anime', 'digital art', 'memes', 'japanese culture']
  },
  {
    id: '5',
    name: 'Marcus Chen',
    age: 26,
    bio: 'Tech enthusiast 💻 | Meme developer 🤖 | Foodie 🍜',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '9',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
        caption: 'Debug life'
      },
      {
        id: '10',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
        caption: 'Food > Everything'
      }
    ],
    anthem: {
      id: '5',
      name: 'Technologic',
      artist: 'Daft Punk',
      albumArt: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/5'
    },
    distance: 4,
    interests: ['technology', 'coding', 'food', 'electronic music']
  },
  {
    id: '6',
    name: 'Luna White',
    age: 24,
    bio: 'Astrology memer ✨ | Plant parent 🌿 | Crystal collector 💎',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop'],
    moodBoard: [
      {
        id: '11',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?w=400&h=400&fit=crop',
        caption: 'Mercury retrograde be like'
      },
      {
        id: '12',
        type: 'MEME',
        url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=400&fit=crop',
        caption: 'Plant addiction'
      }
    ],
    anthem: {
      id: '6',
      name: 'Moon Child',
      artist: 'King Crimson',
      albumArt: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=300&h=300&fit=crop',
      previewUrl: 'https://example.com/preview/6'
    },
    distance: 6,
    interests: ['astrology', 'plants', 'crystals', 'spiritual memes']
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Get the authenticated user's ID
    // 2. Use their preferences and interests to find matching profiles
    // 3. Filter out profiles they've already seen/matched with
    // 4. Apply any additional filters from query parameters
    
    return NextResponse.json({
      status: 'success',
      data: {
        profiles: mockProfiles
      }
    });
  } catch (error) {
    console.error('Error in discover API:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch profiles'
      },
      { status: 500 }
    );
  }
}
