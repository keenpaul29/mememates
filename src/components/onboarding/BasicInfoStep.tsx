import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onChange,
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    age: data.age || '',
    location: data.location || '',
    bio: data.bio || '',
    gender: data.gender || ''
  });

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const isFormValid = () => {
    return formData.name && formData.age && formData.location && formData.bio;
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
          Tell Us About Yourself
        </h2>
        <p className="text-muted-foreground">
          Share some details to help us find your perfect meme match!
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="flex items-center">
            <User className="mr-2 w-4 h-4 text-primary" />
            Name
          </Label>
          <Input 
            placeholder="Your name" 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="flex items-center">
            <Calendar className="mr-2 w-4 h-4 text-primary" />
            Age
          </Label>
          <Input 
            type="number" 
            placeholder="Your age" 
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            min={18}
            max={99}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="flex items-center">
            <MapPin className="mr-2 w-4 h-4 text-primary" />
            Location
          </Label>
          <Input 
            placeholder="City, Country" 
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label className="flex items-center">
            <User className="mr-2 w-4 h-4 text-primary" />
            Gender
          </Label>
          <Select 
            value={formData.gender}
            onValueChange={(value) => handleChange('gender', value)}
          >
            <SelectTrigger className="focus:ring-2 focus:ring-primary/50 transition-all">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-Binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="space-y-2"
      >
        <Label className="flex items-center">
          <User className="mr-2 w-4 h-4 text-primary" />
          Bio
        </Label>
        <Textarea 
          placeholder="Tell us a bit about yourself... What makes you unique?" 
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="min-h-[120px] focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-between"
      >
        <motion.button
          onClick={onBack}
          className="px-6 py-2 text-muted-foreground hover:text-primary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={!isFormValid()}
          className={`
            px-8 py-3 rounded-full shadow-lg transition-all
            ${isFormValid() 
              ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'}
          `}
          whileHover={{ scale: isFormValid() ? 1.05 : 1 }}
          whileTap={{ scale: isFormValid() ? 0.95 : 1 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
