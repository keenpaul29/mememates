'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { removeToken } from '@/lib/token';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only access localStorage on the client side
    setToken(localStorage.getItem('mememates_token'));
  }, []);

  useEffect(() => {
    // Update token when session changes
    if (session?.user) {
      const newToken = localStorage.getItem('mememates_token');
      setToken(newToken);
    } else {
      setToken(null);
    }
  }, [session]);

  const handleSignIn = async (provider?: string) => {
    await signIn(provider || 'google');
  };

  const handleSignOut = async () => {
    removeToken();
    setToken(null);
    await signOut();
  };

  const value = {
    user: session?.user || null,
    token,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
