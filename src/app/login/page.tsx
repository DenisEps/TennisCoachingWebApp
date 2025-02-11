'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (role: 'coach' | 'client') => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signIn(role);
      router.push('/news');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="mt-2 text-gray-600">Choose your role to continue</p>
          {error && (
            <p className="mt-2 text-red-600">{error}</p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin('coach')}
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login as Coach'}
          </button>
          
          <button
            onClick={() => handleLogin('client')}
            disabled={isLoading}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login as Client'}
          </button>
        </div>
      </div>
    </div>
  );
} 