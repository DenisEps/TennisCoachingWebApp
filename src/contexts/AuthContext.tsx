'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/auth';
import { supabaseAdmin } from '@/lib/supabase/config';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (role: 'coach' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (role: 'coach' | 'client') => {
    try {
      // Get the user data from the database
      const { data: userData, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', `demo${role}@example.com`)
        .single();

      if (error) throw error;

      // Create mock session
      const mockSession = {
        user: userData,
        access_token: 'mock_token'
      };

      // Store in localStorage
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      localStorage.setItem('mockUser', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setSession(mockSession as unknown as Session);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Add a function to refresh user data
  const refreshUserData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setUser(data);
        // Update localStorage as well
        localStorage.setItem('mockUser', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Add useEffect to load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('mockUser');
      const storedSession = localStorage.getItem('mockSession');

      if (storedUser && storedSession) {
        setUser(JSON.parse(storedUser));
        setSession(JSON.parse(storedSession));
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

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
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        signIn, 
        signOut, 
        isLoading,
        refreshUserData
      }}
    >
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