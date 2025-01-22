'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NotificationSettingsProps {
  initialData?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    notificationFrequency?: 'immediate' | 'daily' | 'weekly';
  };
  onSave: (data: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationFrequency: 'immediate' | 'daily' | 'weekly';
  }) => void;
}

export function NotificationSettings({ initialData, onSave }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: initialData?.emailNotifications ?? true,
    pushNotifications: initialData?.pushNotifications ?? true,
    notificationFrequency: initialData?.notificationFrequency ?? 'immediate',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-frequency">Notification Frequency</Label>
            <Select
              value={settings.notificationFrequency}
              onValueChange={(value: 'immediate' | 'daily' | 'weekly') =>
                setSettings((prev) => ({ ...prev, notificationFrequency: value }))
              }
            >
              <SelectTrigger id="notification-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Save Notification Settings</Button>
        </CardContent>
      </Card>
    </form>
  );
}
