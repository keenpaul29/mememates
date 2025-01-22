import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Music,
  Play,
  Pause,
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  moodBoard: {
    id: string;
    type: 'MEME' | 'PHOTO';
    url: string;
    caption?: string;
  }[];
  anthem?: {
    id: string;
    name: string;
    artist: string;
    albumArt?: string;
    previewUrl?: string;
  };
  distance: number;
}

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMoodBoard, setShowMoodBoard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? profile.photos.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === profile.photos.length - 1 ? 0 : prev + 1
    );
  };

  const toggleMoodBoard = () => {
    setShowMoodBoard(!showMoodBoard);
  };

  const togglePlay = () => {
    if (!profile.anthem?.previewUrl) return;

    if (playing) {
      audio?.pause();
      setPlaying(false);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(profile.anthem.previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setPlaying(true);

      newAudio.addEventListener('ended', () => {
        setPlaying(false);
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/5] bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={
                showMoodBoard
                  ? profile.moodBoard[currentImageIndex]?.url
                  : profile.photos[currentImageIndex]
              }
              alt={`${profile.name}'s ${
                showMoodBoard ? 'mood board' : 'photo'
              }`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{profile.distance} km away</span>
              </div>
            </div>
            {profile.anthem && (
              <Button
                size="icon"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70"
                onClick={togglePlay}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white">{profile.bio}</p>
          {profile.anthem && (
            <div className="flex items-center gap-2 mt-2 text-white">
              <Music className="h-4 w-4" />
              <span className="text-sm">
                {profile.anthem.name} - {profile.anthem.artist}
              </span>
            </div>
          )}
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
          onClick={handleNextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {(showMoodBoard ? profile.moodBoard : profile.photos).map(
            (_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/50'
                }`}
              />
            )
          )}
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <Button
          variant="outline"
          onClick={toggleMoodBoard}
        >
          {showMoodBoard ? 'View Photos' : 'View Mood Board'}
        </Button>
      </div>
    </Card>
  );
};
