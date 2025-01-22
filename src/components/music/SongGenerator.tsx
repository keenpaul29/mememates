import React, { useState, useRef } from 'react';
import { useAIContent } from '@/hooks/useAIContent';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const moods = [
  { value: 'happy', label: 'Happy' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'chill', label: 'Chill' },
  { value: 'melancholic', label: 'Melancholic' },
];

const genres = [
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Classical' },
  { value: 'hiphop', label: 'Hip Hop' },
];

interface SongGeneratorProps {
  onGenerate?: (song: any) => void;
  context?: any;
  className?: string;
}

export const SongGenerator: React.FC<SongGeneratorProps> = ({
  onGenerate,
  context = {},
  className = '',
}) => {
  const [mood, setMood] = useState('happy');
  const [genre, setGenre] = useState('pop');
  const [generatedSong, setGeneratedSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { loading, generateSong } = useAIContent({
    onSuccess: (data) => {
      setGeneratedSong(data);
      onGenerate?.(data);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateSong(mood, genre, context);
    } catch (error) {
      console.error('Error generating song:', error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return;

    const newVolume = value / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="mood"
            className="text-sm font-medium text-gray-700"
          >
            Mood
          </label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select a mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map((mood) => (
                <SelectItem key={mood.value} value={mood.value}>
                  {mood.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="genre"
            className="text-sm font-medium text-gray-700"
          >
            Genre
          </label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Song'
          )}
        </Button>
      </form>

      {generatedSong && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <audio
                ref={audioRef}
                src={generatedSong.audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) =>
                      handleVolumeChange(value[0])
                    }
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Mood: {mood}</p>
                <p>Genre: {genre}</p>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(generatedSong.audioUrl)
                }
              >
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
