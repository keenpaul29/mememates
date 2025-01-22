'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// Predefined mood and tag options
const MOODS = [
  'Happy', 'Sad', 'Angry', 'Excited', 
  'Calm', 'Nostalgic', 'Romantic', 'Funny'
];

const TAGS = [
  'Trending', 'Classic', 'Viral', 'Original', 
  'Pop Culture', 'Relatable', 'Wholesome'
];

interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    image?: string;
  };
  mood?: string;
  tags: { name: string }[];
  reactions: any[];
}

export default function MemeSearch() {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchMemes = async (e?: FormEvent, resetPage = true) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (selectedMood) params.append('mood', selectedMood);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      params.append('page', resetPage ? '1' : page.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/memes/search?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setMemes(resetPage ? data.memes : [...memes, ...data.memes]);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.currentPage);
      } else {
        toast.error(data.error || 'Failed to search memes');
      }
    } catch (error) {
      toast.error('An error occurred while searching memes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMemes = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      searchMemes(undefined, false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  useEffect(() => {
    searchMemes();
  }, [selectedMood, selectedTags]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={searchMemes} className="mb-6 relative">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search memes..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
            >
              <FaFilter />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood === selectedMood ? '' : mood)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedMood === mood 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag) 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {memes.length === 0 && !isLoading ? (
        <div className="text-center text-gray-500">
          No memes found. Try a different search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memes.map(meme => (
            <div 
              key={meme.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full aspect-square">
                <Image 
                  src={meme.imageUrl} 
                  alt={meme.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{meme.title}</h3>
                <div className="flex items-center mt-2">
                  {meme.creator.image && (
                    <Image 
                      src={meme.creator.image} 
                      alt={meme.creator.name} 
                      width={24} 
                      height={24} 
                      className="rounded-full mr-2"
                    />
                  )}
                  <span className="text-xs text-gray-600">{meme.creator.name}</span>
                </div>
                {meme.mood && (
                  <div className="mt-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {meme.mood}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="text-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      )}

      {page < totalPages && !isLoading && (
        <div className="text-center mt-6">
          <button 
            onClick={loadMoreMemes}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
