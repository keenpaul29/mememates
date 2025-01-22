import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Heart, SmilePlus } from 'lucide-react';

interface SwipeButtonsProps {
  onLike: () => void;
  onPass: () => void;
  onMeme: () => void;
}

export const SwipeButtons: React.FC<SwipeButtonsProps> = ({
  onLike,
  onPass,
  onMeme,
}) => {
  return (
    <div className="flex justify-center gap-4">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 bg-background border-2 border-destructive hover:bg-destructive/10"
          onClick={onPass}
        >
          <X className="h-6 w-6 text-destructive" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 bg-background border-2 border-primary hover:bg-primary/10"
          onClick={onMeme}
        >
          <SmilePlus className="h-6 w-6 text-primary" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 bg-background border-2 border-green-500 hover:bg-green-500/10"
          onClick={onLike}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </motion.div>
    </div>
  );
};
