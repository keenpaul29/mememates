import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface PhotoUploadStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  onSkip
}) => {
  const [photos, setPhotos] = useState<string[]>(data.photos || []);
  const maxPhotos = 6;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validImageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImageFiles.length === 0) {
      toast.error('Please upload valid image files (max 5MB each)');
      return;
    }

    const newPhotos = validImageFiles.map(file => URL.createObjectURL(file));
    const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos);

    setPhotos(updatedPhotos);
    onChange({ photos: updatedPhotos });
  }, [photos, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
    setPhotos(updatedPhotos);
    onChange({ photos: updatedPhotos });
  };

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
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center space-y-4"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Show Your Best Self
        </h2>
        <p className="text-muted-foreground">
          Upload 1-6 photos that showcase your personality and style
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/30 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload 
            className={`
              w-16 h-16 
              ${isDragActive 
                ? 'text-primary animate-pulse' 
                : 'text-muted-foreground'}
            `} 
          />
          <p className="text-lg font-medium">
            {isDragActive 
              ? 'Drop your photos here' 
              : 'Drag & drop photos or click to select'}
          </p>
          <p className="text-sm text-muted-foreground">
            Max 6 photos, 5MB each (JPEG, PNG, GIF, WEBP)
          </p>
        </div>
      </motion.div>

      {photos.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4"
        >
          {photos.map((photo, index) => (
            <motion.div 
              key={photo}
              variants={itemVariants}
              className="relative group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src={photo} 
                  alt={`Profile photo ${index + 1}`} 
                  fill
                  className="object-cover"
                />
              </div>
              <motion.button
                onClick={() => removePhoto(index)}
                className="
                  absolute top-2 right-2 
                  bg-red-500/80 text-white p-1 rounded-full 
                  opacity-0 group-hover:opacity-100 
                  transition-all hover:bg-red-600
                "
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div 
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <motion.button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-primary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onSkip}
            className="text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>

          <motion.button
            onClick={onNext}
            disabled={photos.length === 0}
            className={`
              px-8 py-3 rounded-full shadow-lg transition-all
              ${photos.length > 0 
                ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'}
            `}
            whileHover={{ scale: photos.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: photos.length > 0 ? 0.95 : 1 }}
          >
            {photos.length > 0 ? (
              <>
                <CheckCircle2 className="mr-2 inline-block" />
                Continue
              </>
            ) : (
              'Add Photos'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
