'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileAnalytics } from '@/components/analytics/ProfileAnalytics';
import { MatchAnalytics } from '@/components/analytics/MatchAnalytics';
import { MemeAnalytics } from '@/components/analytics/MemeAnalytics';
import { EngagementAnalytics } from '@/components/analytics/EngagementAnalytics';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status === 'success') {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isPremium) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              Upgrade to Premium to access detailed analytics and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-8 space-y-4 text-center">
              <h3 className="text-2xl font-bold">
                Unlock Advanced Analytics
              </h3>
              <p className="text-muted-foreground">
                Get insights into your profile performance, match statistics,
                and engagement metrics
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Profile visibility and performance metrics
                </li>
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Match quality and compatibility insights
                </li>
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Meme engagement and trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Personalized recommendations
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
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your profile performance and engagement metrics
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="memes">Memes</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileAnalytics data={data?.profile} loading={loading} />
        </TabsContent>

        <TabsContent value="matches">
          <MatchAnalytics data={data?.matches} loading={loading} />
        </TabsContent>

        <TabsContent value="memes">
          <MemeAnalytics data={data?.memes} loading={loading} />
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementAnalytics data={data?.engagement} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
