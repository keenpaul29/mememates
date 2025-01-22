import { useState } from 'react';
import { toast } from 'sonner';

interface AIContentOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAIContent = (options: AIContentOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const generateMeme = async (
    prompt: string,
    style: string,
    context: any = {}
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai-content/meme/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ prompt, style, context }),
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        options.onSuccess?.(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error generating meme:', error);
      toast.error('Failed to generate meme');
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateMemeResponse = async (
    memeUrl: string,
    context: any = {}
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai-content/meme/response`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ memeUrl, context }),
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        options.onSuccess?.(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error generating meme response:', error);
      toast.error('Failed to generate meme response');
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateSong = async (
    mood: string,
    genre: string,
    context: any = {}
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai-content/song/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ mood, genre, context }),
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        options.onSuccess?.(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error generating song:', error);
      toast.error('Failed to generate song');
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateMatchAnthem = async (
    user1Preferences: any,
    user2Preferences: any
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai-content/song/match-anthem`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ user1Preferences, user2Preferences }),
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        options.onSuccess?.(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error generating match anthem:', error);
      toast.error('Failed to generate match anthem');
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateMoodBasedSong = async (moodBoard: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai-content/song/mood-based`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ moodBoard }),
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        options.onSuccess?.(data.data);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error generating mood-based song:', error);
      toast.error('Failed to generate mood-based song');
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateMeme,
    generateMemeResponse,
    generateSong,
    generateMatchAnthem,
    generateMoodBasedSong,
  };
};
