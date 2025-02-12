'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

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
    <div className="min-h-screen flex items-center justify-center bg-[#004D40] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center">
          <Logo size="large" className="mb-6" />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to TopTennis
          </h2>
          {error && (
            <p className="mt-2 text-red-600">{error}</p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin('coach')}
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-primary px-4 py-3 text-white hover:bg-brand-primary-dark disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login as Coach'}
          </button>
          
          <button
            onClick={() => handleLogin('client')}
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-secondary px-4 py-3 text-brand-primary hover:bg-brand-secondary-dark disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login as Client'}
          </button>
        </div>
      </div>
    </div>
  );
} 