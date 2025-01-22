'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MemeGenerator } from '@/components/memes/MemeGenerator';
import { SongGenerator } from '@/components/music/SongGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('meme');

  if (!user?.isPremium) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              Upgrade to Premium to access AI-powered content creation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-8 space-y-4 text-center">
              <h3 className="text-2xl font-bold">
                Unlock Creative Powers
              </h3>
              <p className="text-muted-foreground">
                Create custom memes and generate unique songs with our
                AI-powered tools
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Generate custom memes with DALL-E
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Create unique songs with Gemini
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Get AI-powered creative suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Generate matching anthems for your connections
                </li>
              </ul>
            </div>
            <Button
              size="lg"
              onClick={() => router.push('/premium')}
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">
          Generate custom memes and songs using AI
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="meme">Meme Generator</TabsTrigger>
          <TabsTrigger value="song">Song Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="meme">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Memes</CardTitle>
              <CardDescription>
                Create unique memes using DALL-E AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MemeGenerator
                context={{
                  userId: user.id,
                  preferences: user.preferences,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="song">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Songs</CardTitle>
              <CardDescription>
                Create unique songs using Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SongGenerator
                context={{
                  userId: user.id,
                  preferences: user.preferences,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
