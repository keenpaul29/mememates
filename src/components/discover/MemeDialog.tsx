import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Search } from 'lucide-react';

interface MemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMeme: (memeUrl: string) => void;
  loading: boolean;
}

export const MemeDialog: React.FC<MemeDialogProps> = ({
  open,
  onOpenChange,
  onSendMeme,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [memes, setMemes] = useState<string[]>([]);

  const searchMemes = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memes/search?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      setMemes(data.memes);
    } catch (error) {
      console.error('Error searching memes:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendMeme = (memeUrl: string) => {
    onSendMeme(memeUrl);
    setSearchQuery('');
    setMemes([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send a Meme</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMemes()}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1"
              onClick={searchMemes}
              disabled={searching}
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {memes.map((meme, index) => (
              <motion.div
                key={meme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleSendMeme(meme)}
              >
                <Image
                  src={meme}
                  alt="Meme"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <span className="text-white font-medium">Send Meme</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {memes.length === 0 && !searching && (
            <div className="text-center py-8 text-muted-foreground">
              Search for memes to send
            </div>
          )}

          {searching && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Searching for memes...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
