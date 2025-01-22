import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';

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

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { token, user } = useAuth();

  const fetchMatches = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matches`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setMatches(data.data.matches);
      }
    } catch (err) {
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const updateMatchLastMessage = (matchId: string, message: Message) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            lastMessage: message,
            unreadCount:
              message.senderId !== user?.id
                ? match.unreadCount + 1
                : match.unreadCount,
            updatedAt: new Date().toISOString(),
          };
        }
        return match;
      })
    );
  };

  const markMatchMessagesAsRead = (matchId: string) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            unreadCount: 0,
          };
        }
        return match;
      })
    );
  };

  const addNewMatch = (match: Match) => {
    setMatches((prevMatches) => [match, ...prevMatches]);
  };

  useEffect(() => {
    fetchMatches();
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { matchId: string; message: Message }) => {
      updateMatchLastMessage(data.matchId, data.message);
    };

    const handleNewMatch = (match: Match) => {
      addNewMatch(match);
    };

    const handleMessagesRead = (data: { matchId: string }) => {
      markMatchMessagesAsRead(data.matchId);
    };

    socket.on('message:received', handleNewMessage);
    socket.on('message:sent', handleNewMessage);
    socket.on('match:new', handleNewMatch);
    socket.on('messages:read', handleMessagesRead);

    return () => {
      socket.off('message:received', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
      socket.off('match:new', handleNewMatch);
      socket.off('messages:read', handleMessagesRead);
    };
  }, [socket, user?.id]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    markMatchMessagesAsRead,
  };
};
