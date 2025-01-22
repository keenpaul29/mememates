import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content?: string;
  memeUrl?: string;
  songUrl?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  sender: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
}

interface Match {
  id: string;
  users: Array<{
    id: string;
    name: string;
    profilePhoto?: string;
  }>;
  lastMessage?: Message;
  unreadCount?: number;
}

export const useMatch = (matchId?: string) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const token = localStorage.getItem('auth_token');

  const fetchMatch = useCallback(async () => {
    if (!matchId || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matches/${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setMatch(data.data.match);
      }
    } catch (err) {
      setError('Failed to fetch match details');
    }
  }, [matchId, token]);

  const fetchMessages = useCallback(async () => {
    if (!matchId || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages?matchId=${matchId}`,
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
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [matchId, token]);

  const sendMessage = async (content?: string, memeUrl?: string, songUrl?: string) => {
    if (!matchId || !socket) return;

    try {
      socket.emit('message:send', {
        matchId,
        content,
        memeUrl,
        songUrl,
      });
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!token) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${messageId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const startTyping = () => {
    if (!matchId || !socket) return;
    socket.emit('typing:start', { matchId });
  };

  const stopTyping = () => {
    if (!matchId || !socket) return;
    socket.emit('typing:stop', { matchId });
  };

  useEffect(() => {
    if (matchId) {
      fetchMatch();
      fetchMessages();
    }
  }, [matchId, fetchMatch, fetchMessages]);

  useEffect(() => {
    if (!socket || !matchId) return;

    socket.emit('match:join', matchId);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (message.senderId !== user?.id) {
        markAsRead(message.id);
      }
    };

    const handleTypingStarted = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) {
        setIsTyping(true);
      }
    };

    const handleTypingStopped = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) {
        setIsTyping(false);
      }
    };

    socket.on('message:received', handleNewMessage);
    socket.on('message:sent', handleNewMessage);
    socket.on('typing:started', handleTypingStarted);
    socket.on('typing:stopped', handleTypingStopped);

    return () => {
      socket.emit('match:leave', matchId);
      socket.off('message:received', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
      socket.off('typing:started', handleTypingStarted);
      socket.off('typing:stopped', handleTypingStopped);
    };
  }, [socket, matchId, user?.id]);

  return {
    match,
    messages,
    loading,
    error,
    isTyping,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  };
};
