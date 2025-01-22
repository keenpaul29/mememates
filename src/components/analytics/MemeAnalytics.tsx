import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TreeMap,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  Laugh,
  Share2,
  Repeat,
} from 'lucide-react';

interface MemeAnalyticsProps {
  data: {
    memeEngagement: Array<{
      date: string;
      sent: number;
      received: number;
      reactions: number;
    }>;
    topMemeCategories: Array<{
      category: string;
      count: number;
      engagement: number;
    }>;
    reactionBreakdown: Array<{
      reaction: string;
      count: number;
    }>;
    viralMemes: Array<{
      memeId: string;
      shares: number;
      reactions: number;
      category: string;
    }>;
    responseRate: {
      instant: number;
      quick: number;
      delayed: number;
      none: number;
    };
  } | null;
  loading: boolean;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
const REACTION_COLORS = {
  '😂': '#FFD93D',
  '❤️': '#FF6B6B',
  '👏': '#4ECDC4',
  '🔥': '#FF8066',
  '😮': '#6C5CE7',
};

export const MemeAnalytics: React.FC<MemeAnalyticsProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const totalMemesSent = data.memeEngagement.reduce(
    (acc, curr) => acc + curr.sent,
    0
  );
  const totalReactions = data.memeEngagement.reduce(
    (acc, curr) => acc + curr.reactions,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Memes Sent
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMemesSent}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reactions
            </CardTitle>
            <Laugh className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReactions}</div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Rate
            </CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((data.responseRate.instant + data.responseRate.quick) /
                  (data.responseRate.instant +
                    data.responseRate.quick +
                    data.responseRate.delayed +
                    data.responseRate.none)) *
                  100
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Viral Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (data.viralMemes.length / totalMemesSent) * 100
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meme Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.memeEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#8884d8"
                    name="Sent"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="received"
                    stroke="#82ca9d"
                    name="Received"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="reactions"
                    stroke="#ffc658"
                    name="Reactions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Meme Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <TreeMap
                  data={data.topMemeCategories}
                  dataKey="engagement"
                  ratio={4 / 3}
                  stroke="#fff"
                  fill="#8884d8"
                >
                  <Tooltip />
                </TreeMap>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.reactionBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      reaction,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x =
                        cx +
                        radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy +
                        radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${reaction} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.reactionBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          REACTION_COLORS[
                            entry.reaction as keyof typeof REACTION_COLORS
                          ] || COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viral Memes Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.viralMemes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="shares" fill="#8884d8" name="Shares" />
                  <Bar
                    dataKey="reactions"
                    fill="#82ca9d"
                    name="Reactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
