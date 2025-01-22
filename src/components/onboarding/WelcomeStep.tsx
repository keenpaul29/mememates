import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center justify-center space-x-4"
        variants={itemVariants}
      >
        <Sparkles 
          className="w-16 h-16 text-primary animate-pulse" 
          strokeWidth={1.5} 
        />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Welcome to MemeMAtes
        </h1>
      </motion.div>

      <motion.div 
        className="max-w-2xl space-y-6"
        variants={itemVariants}
      >
        <p className="text-xl text-muted-foreground leading-relaxed">
          Get ready to connect, laugh, and find your perfect match through the power of memes and shared humor!
        </p>
        
        <div className="grid grid-cols-3 gap-6 mt-8">
          <motion.div 
            className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-12 h-12 text-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <p className="text-sm text-muted-foreground">
              Meet people who share your sense of humor
            </p>
          </motion.div>

          <motion.div 
            className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-12 h-12 text-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">Match</h3>
            <p className="text-sm text-muted-foreground">
              Find connections based on shared interests
            </p>
          </motion.div>

          <motion.div 
            className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-12 h-12 text-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">Enjoy</h3>
            <p className="text-sm text-muted-foreground">
              Experience dating with a fun, meme-filled twist
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
