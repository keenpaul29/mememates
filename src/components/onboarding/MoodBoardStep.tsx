import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImagePlus, X, GripVertical, Search } from 'lucide-react';
import Image from 'next/image';

interface MoodBoardItem {
  id: string;
  type: 'MEME' | 'PHOTO';
  url: string;
  caption?: string;
}

interface MoodBoardStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MoodBoardStep: React.FC<MoodBoardStepProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [items, setItems] = useState<MoodBoardItem[]>(data.moodBoard || []);
  const [selectedItem, setSelectedItem] = useState<MoodBoardItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const newItems = await Promise.all(
      acceptedFiles.map(async (file) => {
        const url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          id: Math.random().toString(36).substring(7),
          type: 'PHOTO' as const,
          url,
        };
      })
    );

    const updatedItems = [...items, ...newItems].slice(0, 9);
    setItems(updatedItems);
    onChange({ moodBoard: updatedItems });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 9 - items.length,
    disabled: items.length >= 9,
  });

  const searchMemes = async (query: string) => {
    setSearching(true);
    try {
      const response = await fetch(
        `/api/memes/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search memes');
      }

      const data = await response.json();
      setSearchResults(data.memes);
    } catch (error) {
      console.error('Error searching memes:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to search memes'
      );
    } finally {
      setSearching(false);
    }
  };

  const addMeme = (url: string) => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      type: 'MEME' as const,
      url,
    };
    const updatedItems = [...items, newItem].slice(0, 9);
    setItems(updatedItems);
    onChange({ moodBoard: updatedItems });
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onChange({ moodBoard: updatedItems });
  };

  const updateCaption = (id: string, caption: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, caption } : item
    );
    setItems(updatedItems);
    onChange({ moodBoard: updatedItems });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Create Your Mood Board</h3>
        <p className="text-sm text-muted-foreground">
          Express yourself through a mix of photos and memes. Add captions to tell your story!
        </p>
      </div>

      <div className="flex gap-4">
        <div
          {...getRootProps()}
          className="flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Upload photos ({9 - items.length} remaining)
          </p>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMemes(searchQuery)}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1"
              onClick={() => searchMemes(searchQuery)}
              disabled={searching}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(newOrder) => {
          setItems(newOrder);
          onChange({ moodBoard: newOrder });
        }}
        className="space-y-2"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="flex items-center gap-4 bg-card p-2 rounded-lg"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
            <div className="relative h-20 w-20 rounded-md overflow-hidden">
              <Image
                src={item.url}
                alt={item.caption || ''}
                fill
                className="object-cover"
              />
            </div>
            <Input
              placeholder="Add a caption..."
              value={item.caption || ''}
              onChange={(e) => updateCaption(item.id, e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Dialog
        open={!!searchResults.length}
        onOpenChange={() => setSearchResults([])}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Meme Search Results</DialogTitle>
          </DialogHeader>

          {searching ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No memes found. Try a different search query.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {searchResults.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => addMeme(url)}
                >
                  <Image
                    src={url}
                    alt={`Meme ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={items.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
