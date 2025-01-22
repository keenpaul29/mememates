import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, ImageIcon } from 'lucide-react';

interface Match {
  id: string;
  users: Array<{
    id: string;
    name: string;
    profilePhoto?: string;
  }>;
  lastMessage?: {
    id: string;
    content?: string;
    memeUrl?: string;
    songUrl?: string;
    senderId: string;
    createdAt: string;
    read: boolean;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MatchListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
}) => {
  const sortedMatches = [...matches].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const getLastMessagePreview = (match: Match) => {
    if (!match.lastMessage) {
      return 'New match! Send a meme to start chatting';
    }

    if (match.lastMessage.memeUrl) {
      return '🎭 Sent a meme';
    }

    if (match.lastMessage.songUrl) {
      return '🎵 Shared a song';
    }

    return match.lastMessage.content || '';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Matches</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedMatches.map((match) => {
            const otherUser = match.users.find(
              (user) => user.id !== localStorage.getItem('userId')
            );

            if (!otherUser) return null;

            return (
              <div
                key={match.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                  selectedMatchId === match.id
                    ? 'bg-accent'
                    : 'hover:bg-accent/50'
                )}
                onClick={() => onSelectMatch(match.id)}
              >
                <div className="relative">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    {otherUser.profilePhoto ? (
                      <Image
                        src={otherUser.profilePhoto}
                        alt={otherUser.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                  {match.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">
                      {otherUser.name}
                    </h3>
                    {match.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(match.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-sm truncate',
                      match.unreadCount > 0
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    {getLastMessagePreview(match)}
                  </p>
                </div>
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p>No matches yet.</p>
              <p className="text-sm">
                Keep swiping to find your meme mate!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
