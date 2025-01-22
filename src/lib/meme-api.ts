// Meme API Utility Functions
export interface MemeSearchParams {
  page?: number;
  limit?: number;
  mood?: string;
  style?: string;
}

export interface MemeCreateParams {
  imageUrl: string;
  prompt: string;
  mood?: string;
  style?: string;
}

export class MemeAPI {
  private static BASE_URL = '/api/memes';

  // Fetch memes with optional filtering
  static async searchMemes(params: MemeSearchParams = {}) {
    const { 
      page = 1, 
      limit = 20, 
      mood, 
      style 
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(mood && { mood }),
      ...(style && { style })
    });

    const response = await fetch(`${this.BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch memes');
    }

    return response.json();
  }

  // Get a single meme by ID
  static async getMeme(memeId: string) {
    const response = await fetch(`${this.BASE_URL}/${memeId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch meme');
    }

    return response.json();
  }

  // Create a new meme
  static async createMeme(memeData: MemeCreateParams) {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memeData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create meme');
    }

    return response.json();
  }

  // Update an existing meme
  static async updateMeme(
    memeId: string, 
    updateData: Partial<MemeCreateParams>
  ) {
    const response = await fetch(`${this.BASE_URL}/${memeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update meme');
    }

    return response.json();
  }

  // Delete a meme
  static async deleteMeme(memeId: string) {
    const response = await fetch(`${this.BASE_URL}/${memeId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete meme');
    }

    return response.json();
  }
}

// Example usage in a component:
/*
async function ExampleMemeUsage() {
  try {
    // Search memes
    const searchResults = await MemeAPI.searchMemes({ 
      mood: 'HAPPY', 
      page: 1 
    });

    // Create a new meme
    const newMeme = await MemeAPI.createMeme({
      imageUrl: 'https://example.com/meme.jpg',
      prompt: 'Funny meme about coding',
      mood: 'FUNNY'
    });

    // Update a meme
    const updatedMeme = await MemeAPI.updateMeme(newMeme.id, {
      prompt: 'Updated meme prompt'
    });

    // Delete a meme
    await MemeAPI.deleteMeme(newMeme.id);
  } catch (error) {
    console.error('Meme API Error:', error);
  }
}
*/
