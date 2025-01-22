'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AnthemSettingsProps {
  initialData?: {
    anthem?: string;
  };
  onSave: (data: { anthem: string }) => void;
}

export function AnthemSettings({ initialData, onSave }: AnthemSettingsProps) {
  const [anthem, setAnthem] = useState(initialData?.anthem || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ anthem });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Anthem Settings</CardTitle>
          <CardDescription>
            Set your profile anthem - a song that represents you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anthem">Anthem URL</Label>
            <Input
              id="anthem"
              placeholder="Spotify or YouTube URL"
              value={anthem}
              onChange={(e) => setAnthem(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Add a Spotify or YouTube link to your favorite song
            </p>
          </div>
          <Button type="submit">Save Anthem</Button>
        </CardContent>
      </Card>
    </form>
  );
}
