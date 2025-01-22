'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'MATCH' | 'LIKE' | 'MESSAGE';
  title: string;
  content: string;
  metadata: any;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  fetchNotifications: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const { token } = useAuth();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.notifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMatch = (data: any) => {
      toast.success(`New match with ${data.user.name}!`);
      fetchNotifications();
    };

    const handleNewLike = (data: any) => {
      toast.success(`${data.sender.name} liked your profile!`);
      fetchNotifications();
    };

    const handleNewMessage = (data: any) => {
      toast(`New message from ${data.sender.name}`, {
        icon: '💬',
      });
      fetchNotifications();
    };

    socket.on('match:new', handleNewMatch);
    socket.on('like:received', handleNewLike);
    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('match:new', handleNewMatch);
      socket.off('like:received', handleNewLike);
      socket.off('message:new', handleNewMessage);
    };
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
