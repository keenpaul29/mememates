'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMatches } from '@/hooks/useMatches';
import { MatchList } from '@/components/matches/MatchList';
import { ChatWindow } from '@/components/matches/ChatWindow';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function MatchesPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { matches, loading, error } = useMatches();
  const { token } = useAuth();

  const selectedMatch = matches.find((match) => match.id === selectedMatchId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="w-full md:w-[320px] border-r">
        <MatchList
          matches={matches}
          selectedMatchId={selectedMatchId}
          onSelectMatch={setSelectedMatchId}
        />
      </div>
      <div className="flex-1 hidden md:block">
        {selectedMatch ? (
          <ChatWindow match={selectedMatch} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Select a match to start chatting
            </h3>
            <p className="text-muted-foreground">
              Share memes and music to break the ice!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
