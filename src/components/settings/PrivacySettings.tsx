'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PrivacySettingsProps {
  initialData?: {
    isProfilePublic?: boolean;
    showOnlineStatus?: boolean;
    allowMessages?: boolean;
  };
  onSave: (data: {
    isProfilePublic: boolean;
    showOnlineStatus: boolean;
    allowMessages: boolean;
  }) => void;
}

export function PrivacySettings({ initialData, onSave }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    isProfilePublic: initialData?.isProfilePublic ?? true,
    showOnlineStatus: initialData?.showOnlineStatus ?? true,
    allowMessages: initialData?.allowMessages ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Manage your profile privacy and visibility settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your profile
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={settings.isProfilePublic}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, isProfilePublic: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="online-status">Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you're online
              </p>
            </div>
            <Switch
              id="online-status"
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showOnlineStatus: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-messages">Direct Messages</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to send you messages
              </p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.allowMessages}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, allowMessages: checked }))
              }
            />
          </div>
          <Button type="submit" className="w-full">Save Privacy Settings</Button>
        </CardContent>
      </Card>
    </form>
  );
}
