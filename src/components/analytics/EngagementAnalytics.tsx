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
  ComposedChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  Clock,
  MessageSquare,
  Music,
} from 'lucide-react';

interface EngagementAnalyticsProps {
  data: {
    dailyActivity: Array<{
      date: string;
      swipes: number;
      matches: number;
      messages: number;
      memes: number;
    }>;
    sessionMetrics: {
      averageSessionLength: number;
      sessionsPerDay: number;
      peakHours: Array<{
        hour: number;
        activity: number;
      }>;
    };
    featureUsage: Array<{
      feature: string;
      usage: number;
      trend: number;
    }>;
    retentionData: Array<{
      day: number;
      retention: number;
      activeUsers: number;
    }>;
    musicEngagement: Array<{
      genre: string;
      matches: number;
      conversations: number;
    }>;
  } | null;
  loading: boolean;
}

export const EngagementAnalytics: React.FC<EngagementAnalyticsProps> = ({
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

  const totalDailyActions = data.dailyActivity.reduce(
    (acc, curr) =>
      acc + curr.swipes + curr.matches + curr.messages + curr.memes,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Actions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalDailyActions / data.dailyActivity.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Session Length
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data.sessionMetrics.averageSessionLength)} min
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages/Match
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                data.dailyActivity.reduce(
                  (acc, curr) => acc + curr.messages,
                  0
                ) /
                  data.dailyActivity.reduce(
                    (acc, curr) => acc + curr.matches,
                    0
                  )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Music Match Rate
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (data.musicEngagement.reduce(
                  (acc, curr) => acc + curr.matches,
                  0
                ) /
                  data.dailyActivity.reduce(
                    (acc, curr) => acc + curr.matches,
                    0
                  )) *
                  100
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="swipes"
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                  <Bar dataKey="matches" fill="#82ca9d" />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="memes"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Activity Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sessionMetrics.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="activity"
                    fill="#8884d8"
                    name="Activity Level"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.featureUsage}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="retention"
                    stroke="#8884d8"
                    name="Retention Rate"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#82ca9d"
                    name="Active Users"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
