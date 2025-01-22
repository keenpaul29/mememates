'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { MoodBoardSettings } from '@/components/settings/MoodBoardSettings';
import { AnthemSettings } from '@/components/settings/AnthemSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const [saving, setSaving] = useState(false);
  const { user, updateProfile } = useAuth();

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, mood board, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="moodboard">Mood Board</TabsTrigger>
            <TabsTrigger value="anthem">Anthem</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings
              initialData={user}
              onSave={handleSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="moodboard" className="space-y-4">
            <MoodBoardSettings
              initialData={user?.moodBoard}
              onSave={handleSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="anthem" className="space-y-4">
            <AnthemSettings
              initialData={user?.anthem}
              onSave={handleSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <PrivacySettings
              initialData={user?.privacy}
              onSave={handleSave}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings
              initialData={user?.notifications}
              onSave={handleSave}
              saving={saving}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
