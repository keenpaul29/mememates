'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { 
  Heart, 
  X, 
  Sparkles, 
  RefreshCw, 
  Loader2, 
  MessageCircle, 
  Music,
  Search,
  Filter,
  Image as ImageIcon,
  Users,
  Hash
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  interests: string[];
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<'users' | 'memes'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    distance: 50,
    ageRange: [18, 99],
    interests: [] as string[],
    memeCategories: [] as string[]
  });
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const currentMoodBoardIndex = 0;

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        mode,
        q: searchQuery,
        tags: selectedTags.join(','),
        distance: filters.distance.toString(),
        ageRange: filters.ageRange.join(','),
        interests: filters.interests.join(','),
        memeCategories: filters.memeCategories.join(',')
      });
      
      const response = await fetch(`/api/profiles/discover?${queryParams}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setProfiles(data.data.profiles);
        setCurrentIndex(0);
      } else {
        toast.error('Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [mode, searchQuery, selectedTags, filters]);

  const handleAction = async (action: 'like' | 'pass') => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    try {
      // Only make the API call if we have a token
      if (token) {
        const response = await fetch(`/api/profiles/${profile.id}/${action}`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        
        if (result.status !== 'success') {
          toast.error(result.message || 'Action failed');
          return;
        }
      }

      // Proceed with animation and next profile regardless of API call
      await controls.start({ 
        x: action === 'like' ? 500 : -500, 
        opacity: 0,
        transition: { duration: 0.5 }
      });
      setCurrentIndex(prev => prev + 1);

      // Notify via socket if connected
      if (socket?.connected && action === 'like') {
        socket.emit('profile:like', { profileId: profile.id });
      }
    } catch (error) {
      console.error(`Error ${action}ing profile:`, error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > 100) {
      handleAction(offset.x > 0 ? 'like' : 'pass');
    } else {
      controls.start({ x: 0, rotate: 0, opacity: 1 });
    }
    
    setDragging(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    handleAction(direction === 'left' ? 'pass' : 'like');
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <Loader2 className="h-16 w-16 text-white animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <Sparkles className="h-24 w-24 text-white mb-6 animate-pulse" />
        <h2 className="text-3xl font-bold text-white mb-4">
          No More Profiles
        </h2>
        <p className="text-white/80 mb-6 max-w-md text-center">
          You&apos;ve explored all available profiles. Come back later or adjust your preferences to find more matches!
        </p>
        <Button 
          onClick={fetchProfiles} 
          variant="secondary" 
          className="flex items-center space-x-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Profiles
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center p-4">
      {/* Header with Search and Filters */}
      <div className="w-full max-w-md mb-6 space-y-4">
        <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as 'users' | 'memes')}>
          <TabsList className="w-full">
            <TabsTrigger value="users" className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="memes" className="flex-1">
              <ImageIcon className="mr-2 h-4 w-4" />
              Memes
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder={`Search ${mode === 'users' ? 'users' : 'memes'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Customize your discovery preferences
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {mode === 'users' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Distance (km)</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={filters.distance}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          distance: parseInt(e.target.value)
                        }))}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-500">{filters.distance} km</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interests</label>
                      <div className="flex flex-wrap gap-2">
                        {['Memes', 'Gaming', 'Music', 'Movies', 'Sports'].map(interest => (
                          <Badge
                            key={interest}
                            variant={filters.interests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setFilters(prev => ({
                                ...prev,
                                interests: prev.interests.includes(interest)
                                  ? prev.interests.filter(i => i !== interest)
                                  : [...prev.interests, interest]
                              }));
                            }}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {['Funny', 'Trending', 'Gaming', 'Anime', 'Pets'].map(category => (
                        <Badge
                          key={category}
                          variant={filters.memeCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              memeCategories: prev.memeCategories.includes(category)
                                ? prev.memeCategories.filter(c => c !== category)
                                : [...prev.memeCategories, category]
                            }));
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
              >
                <Hash className="mr-1 h-3 w-3" />
                {tag}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex-1">
        <AnimatePresence>
          <motion.div
            ref={cardRef}
            key={currentProfile.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ scale: 0.95, opacity: 0 }}
            exit={{ x: 0, opacity: 0, scale: 0.95 }}
            whileInView={{ scale: 1, opacity: 1 }}
            style={{ x, rotate }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full aspect-[3/4] cursor-grab active:cursor-grabbing"
          >
            {/* Profile Card */}
            <div className="absolute inset-0 bg-black rounded-2xl shadow-2xl overflow-hidden">
              {/* Profile Images Carousel */}
              <div className="absolute inset-0">
                <Image 
                  src={currentProfile.photos[0]} 
                  alt={currentProfile.name} 
                  fill 
                  className="object-cover opacity-90"
                  priority
                />
                {/* Dark overlay for better text visibility */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)' 
                  }} 
                />
              </div>

              <div className="relative h-full w-full">
                {/* Like/Dislike Indicators */}
                <div className="absolute top-6 left-6 z-20">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    style={{ opacity: likeOpacity }}
                    transition={{ duration: 0.2 }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl transform -rotate-12 shadow-lg"
                  >
                    LIKE
                  </motion.div>
                </div>
                <div className="absolute top-6 right-6 z-20">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    style={{ opacity: nopeOpacity }}
                    transition={{ duration: 0.2 }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl transform rotate-12 shadow-lg"
                  >
                    NOPE
                  </motion.div>
                </div>

                {/* Profile Details */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                  <div className="space-y-4">
                    {/* Name, Age, and Distance */}
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                          {currentProfile.name}
                          <span className="text-3xl ml-2 text-white/90">{currentProfile.age}</span>
                        </h2>
                        <div className="flex items-center text-white/90 text-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg" />
                            {currentProfile.distance} km away
                          </span>
                        </div>
                      </div>
                      {currentProfile.anthem && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white/20 backdrop-blur-sm p-3 rounded-full group transition-all duration-300 hover:bg-white/30 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Play anthem preview
                          }}
                        >
                          <Music className="h-6 w-6 text-white group-hover:text-white transition-colors" />
                        </motion.button>
                      )}
                    </div>

                    {/* Bio */}
                    <p className="text-base text-white/95 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] line-clamp-2">
                      {currentProfile.bio}
                    </p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map(interest => (
                        <span
                          key={interest}
                          className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-lg border border-white/10"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute -bottom-20 left-0 right-0 flex justify-center space-x-6 px-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => handleSwipe('left')}
                    >
                      <X className="h-7 w-7 text-red-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all"
                      onClick={() => handleSwipe('right')}
                    >
                      <Heart className="h-7 w-7 text-green-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-8 mt-8"
        >
          <motion.button
            onClick={() => handleAction('pass')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 text-white p-4 rounded-full"
          >
            <X className="h-8 w-8" />
          </motion.button>

          <motion.button
            onClick={() => handleAction('like')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 text-white p-4 rounded-full"
          >
            <Heart className="h-8 w-8" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
