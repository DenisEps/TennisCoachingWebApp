'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/config';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (role: 'coach' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create base64url string
const base64url = (str: string) => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Create mock data based on role
const createMockData = (role: 'coach' | 'client') => {
  const mockUser = {
    id: role === 'coach' 
      ? '00000000-0000-0000-0000-000000000001'  // UUID format for coach
      : '00000000-0000-0000-0000-000000000002', // UUID format for client
    email: `demo${role}@example.com`,
    role: role,
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;

  // Create a properly formatted JWT token
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    sub: mockUser.id,
    email: mockUser.email,
    role: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 3600
  }));
  const signature = base64url('mock_signature');

  const mockToken = `${header}.${payload}.${signature}`;

  const mockSession = {
    user: mockUser,
    access_token: mockToken,
    refresh_token: `mock_refresh_${role}`,
    expires_in: 3600,
  } as Session;

  return { mockUser, mockSession };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('mockSession');
    const storedUser = localStorage.getItem('mockUser');
    
    if (storedSession && storedUser) {
      setSession(JSON.parse(storedSession));
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (role: 'coach' | 'client') => {
    try {
      const { mockUser, mockSession } = createMockData(role);

      // Store in localStorage
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      localStorage.setItem('mockUser', JSON.stringify(mockUser));

      // Update state
      setUser(mockUser);
      setSession(mockSession);

      return;

      // The following code will be uncommented when we fix the Supabase auth
      /*
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `demo${role}@example.com`,
        password: 'demo123',
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            role: role,
          });

        if (profileError) throw profileError;
      }
      */
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    // Clear localStorage
    localStorage.removeItem('mockSession');
    localStorage.removeItem('mockUser');

    // Clear state
    setUser(null);
    setSession(null);

    // The following code will be uncommented when we fix Supabase auth
    /*
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    */
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 