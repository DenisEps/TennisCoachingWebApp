'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SessionManager } from '@/components/sessions/SessionManager';

export default function ClientDashboard() {
  const { user, session, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        setIsRedirecting(true);
        router.push('/login');
      } else if (user?.role !== 'client') {
        setIsRedirecting(true);
        router.push('/dashboard/coach');
      }
    }
  }, [session, user, isLoading, router]);

  if (isLoading || isRedirecting || !session || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Client Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <SessionManager role="client" />
        </div>
      </main>
    </div>
  );
} 