'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { BasicInfoStep } from '@/components/onboarding/BasicInfoStep';
import { PhotoUploadStep } from '@/components/onboarding/PhotoUploadStep';
import { MoodBoardStep } from '@/components/onboarding/MoodBoardStep';
import { AnthemStep } from '@/components/onboarding/AnthemStep';
import { PreferencesStep } from '@/components/onboarding/PreferencesStep';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const steps = [
  { title: 'Welcome', icon: '👋' },
  { title: 'Basic Info', icon: '📝' },
  { title: 'Photos', icon: '📸' },
  { title: 'Mood Board', icon: '🎨' },
  { title: 'Anthem', icon: '🎵' },
  { title: 'Preferences', icon: '⚙️' }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bio: '',
    interests: [],
    photos: [],
    moodBoard: [],
    anthem: null,
    preferences: {
      ageRange: [18, 35],
      distance: 50,
      gender: [],
      lookingFor: 'relationship',
    },
  });
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  // Animated transitions
  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleComplete = async () => {
    try {
      await updateProfile(formData);
      toast.success('Profile created successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
      router.push('/discover');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to complete profile');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <WelcomeStep onNext={handleNext} />;
      case 1: return (
        <BasicInfoStep
          data={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
      case 2: return (
        <PhotoUploadStep
          data={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      );
      case 3: return (
        <MoodBoardStep
          data={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
      case 4: return (
        <AnthemStep
          data={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      );
      case 5: return (
        <PreferencesStep
          data={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Step Indicator */}
        <CardHeader className="bg-white/10 backdrop-blur-md p-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`
                  flex flex-col items-center 
                  ${index <= currentStep 
                    ? 'text-primary opacity-100' 
                    : 'text-muted-foreground opacity-50'}
                  transition-all
                `}
                animate={{ 
                  scale: index === currentStep ? 1.1 : 1,
                  y: index === currentStep ? -5 : 0
                }}
              >
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs font-medium mt-1">{step.title}</span>
                {index < currentStep && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
          <Progress 
            value={((currentStep + 1) / steps.length) * 100} 
            className="mt-4 h-1.5 bg-white/20"
          />
        </CardHeader>

        {/* Animated Step Content */}
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        {/* Navigation Buttons */}
        <CardFooter className="bg-white/5 backdrop-blur-md p-4 flex justify-between">
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="group"
            >
              <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition" />
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              className="group ml-auto"
            >
              Next
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Complete Profile
              <CheckCircle2 className="ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
