import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemeDialog } from '@/components/discover/MemeDialog';
import { cn } from '@/lib/utils';
import {
  MoreVertical,
  Music,
  SmilePlus,
  ImageIcon,
  Play,
  Pause,
  User,
} from 'lucide-react';

interface Message {
  id: string;
  content?: string;
  memeUrl?: string;
  songUrl?: string;
  senderId: string;
  createdAt: string;
  read: boolean;
}

interface Match {
  id: string;
  users: Array<{
    id: string;
    name: string;
    profilePhoto?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatWindowProps {
  match: Match;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ match }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [memeDialogOpen, setMemeDialogOpen] = useState(false);
  const [sendingMeme, setSendingMeme] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const otherUser = match.users.find((u) => u.id !== user?.id);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();
  }, [match.id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: {
      matchId: string;
      message: Message;
    }) => {
      if (data.matchId === match.id) {
        setMessages((prev) => [...prev, data.message]);
        markMessagesAsRead();
      }
    };

    socket.on('message:received', handleNewMessage);
    socket.on('message:sent', handleNewMessage);

    return () => {
      socket.off('message:received', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
    };
  }, [socket, match.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matches/${match.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matches/${match.id}/messages/read`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMeme = async (memeUrl: string) => {
    setSendingMeme(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matches/${match.id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memeUrl }),
        }
      );
      setMemeDialogOpen(false);
    } catch (error) {
      console.error('Error sending meme:', error);
    } finally {
      setSendingMeme(false);
    }
  };

  const togglePlay = (songUrl: string) => {
    if (playing === songUrl) {
      audio?.pause();
      setPlaying(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(songUrl);
      newAudio.play();
      setAudio(newAudio);
      setPlaying(songUrl);

      newAudio.addEventListener('ended', () => {
        setPlaying(null);
      });
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === user?.id;

    return (
      <div
        key={message.id}
        className={cn(
          'flex flex-col max-w-[70%] space-y-2 mb-4',
          isOwnMessage ? 'ml-auto' : 'mr-auto'
        )}
      >
        {message.memeUrl && (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={message.memeUrl}
              alt="Meme"
              fill
              className="object-cover"
            />
          </div>
        )}

        {message.songUrl && (
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => togglePlay(message.songUrl!)}
              >
                {playing === message.songUrl ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Song Title</p>
                <p className="text-sm text-muted-foreground truncate">
                  Artist Name
                </p>
              </div>
            </div>
          </div>
        )}

        {message.content && (
          <div
            className={cn(
              'rounded-lg px-4 py-2',
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {message.content}
          </div>
        )}

        <span
          className={cn(
            'text-xs text-muted-foreground',
            isOwnMessage ? 'text-right' : 'text-left'
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            {otherUser?.profilePhoto ? (
              <Image
                src={otherUser.profilePhoto}
                alt={otherUser.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
          <h2 className="font-semibold">{otherUser?.name}</h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Unmatch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setMemeDialogOpen(true)}
          >
            <SmilePlus className="h-5 w-5 mr-2" />
            Send a Meme
          </Button>
          <Button variant="outline" className="flex-1">
            <Music className="h-5 w-5 mr-2" />
            Share a Song
          </Button>
        </div>
      </div>

      <MemeDialog
        open={memeDialogOpen}
        onOpenChange={setMemeDialogOpen}
        onSendMeme={handleSendMeme}
        loading={sendingMeme}
      />
    </div>
  );
};
