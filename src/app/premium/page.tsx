'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sparkles,
  Zap,
  Crown,
  Check,
  Music,
  ImagePlus,
  TrendingUp,
  Palette,
} from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: [
      'Limited swipes per day',
      'Basic meme templates',
      'Standard match queue',
      'Regular profile visibility',
    ],
    icon: Zap,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 9.99,
    features: [
      'Unlimited swipes',
      'Premium meme templates',
      'Priority match queue',
      'Enhanced profile visibility',
      'Custom mood board themes',
      'Ad-free experience',
    ],
    icon: Sparkles,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    features: [
      'All Plus features',
      'AI-curated matches',
      'Custom anthem creation',
      'Exclusive meme templates',
      'Profile boosting',
      'Advanced analytics',
      'VIP support',
    ],
    icon: Crown,
  },
];

const features = [
  {
    title: 'AI-Powered Matches',
    description: 'Get matched with users who share your meme taste and vibe',
    icon: TrendingUp,
  },
  {
    title: 'Custom Anthems',
    description: 'Create unique music snippets to express yourself',
    icon: Music,
  },
  {
    title: 'Premium Memes',
    description: 'Access exclusive meme templates and trending content',
    icon: ImagePlus,
  },
  {
    title: 'Theme Creator',
    description: 'Design custom themes for your mood board',
    icon: Palette,
  },
];

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    // Implement subscription logic
    console.log('Subscribe to plan:', planId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center text-white space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Upgrade Your Vibe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl"
          >
            Get more matches, exclusive features, and premium content
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative h-full bg-white/10 backdrop-blur-lg border-none text-white">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? 'bg-white shadow-xl scale-105'
                    : 'bg-white/90'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <plan.icon className="h-6 w-6" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {plan.price === 0
                        ? 'Free'
                        : `$${plan.price}/month`}
                    </span>
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    Perfect for {plan.name.toLowerCase()} users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center text-white">
          <p className="text-sm">
            All subscriptions automatically renew unless auto-renew is turned
            off at least 24 hours before the end of the current period.
          </p>
        </div>
      </div>
    </div>
  );
}
