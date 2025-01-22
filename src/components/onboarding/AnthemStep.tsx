import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Music, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Song {
  id: string;
  name: string;
  artist: string;
  albumArt?: string;
  previewUrl?: string;
}

interface AnthemStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const AnthemStep: React.FC<AnthemStepProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  onSkip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(data.anthem || null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const searchSongs = async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `/api/anthem/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Song search error:', data);
        throw new Error(
          data.details || 
          data.error || 
          'Failed to search songs'
        );
      }

      if (!data.tracks || data.tracks.length === 0) {
        toast.error('No songs found. Try a different search.');
        setSearchResults([]);
        return;
      }

      setSearchResults(data.tracks);
    } catch (error) {
      console.error('Error searching songs:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to search songs'
      );
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectSong = (song: Song) => {
    setSelectedSong(song);
    onChange({ anthem: song });
    setSearchResults([]);
    setSearchQuery('');
  };

  const togglePlay = (song: Song) => {
    if (!song.previewUrl) return;

    if (playing === song.id) {
      audio?.pause();
      setPlaying(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(song.previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setPlaying(song.id);

      newAudio.addEventListener('ended', () => {
        setPlaying(null);
      });
    }
  };

  const renderSongCard = (song: Song, isSelected: boolean = false) => (
    <div
      key={song.id}
      className={`
        flex items-center gap-4 p-4 rounded-lg cursor-pointer
        ${
          isSelected
            ? 'bg-primary/10 border-primary'
            : 'bg-card hover:bg-accent'
        }
        transition-colors
      `}
      onClick={() => !isSelected && selectSong(song)}
    >
      <div className="relative h-16 w-16 rounded-md overflow-hidden">
        {song.albumArt ? (
          <Image
            src={song.albumArt}
            alt={song.name}
            fill
            className="object-cover"
            onError={(e) => {
              console.error('Image load error:', song.albumArt);
              e.currentTarget.style.display = 'none';
            }}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
            <Music className="h-8 w-8 text-primary" />
          </div>
        )}
        {song.previewUrl && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(song);
            }}
          >
            {playing === song.id ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </Button>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{song.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {song.artist}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Your Anthem</h3>
        <p className="text-sm text-muted-foreground">
          Select a song that represents you. This will be featured on your profile!
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchSongs(searchQuery)}
          />
          <Button
            size="sm"
            className="absolute right-1 top-1"
            onClick={() => searchSongs(searchQuery)}
            disabled={searching}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <Label>Search Results</Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {searchResults.map((song) => renderSongCard(song))}
            </div>
          </div>
        )}

        {selectedSong && (
          <div className="space-y-2">
            <Label>Selected Anthem</Label>
            {renderSongCard(selectedSong, true)}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedSong}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
