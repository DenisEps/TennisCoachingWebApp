'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AvailabilityManager } from '@/components/availability/AvailabilityManager';
import { SessionManager } from '@/components/sessions/SessionManager';

export default function CoachDashboard() {
  const { user, session, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        setIsRedirecting(true);
        router.push('/login');
      } else if (user?.role !== 'coach') {
        setIsRedirecting(true);
        router.push('/dashboard/client');
      }
    }
  }, [session, user, isLoading, router]);

  const handleManageSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked');
    console.log('Current showAvailability:', showAvailability);
    setShowAvailability(prev => {
      console.log('Setting showAvailability to:', !prev);
      return !prev;
    });
  };

  // Show loading state while checking auth or during redirect
  if (isLoading || isRedirecting || !session || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  console.log('Rendering coach dashboard, showAvailability:', showAvailability);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Coach Dashboard
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Availability Section */}
          <section className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Availability
              </h2>
              <button
                onClick={handleManageSchedule}
                className="rounded-md bg-brand-primary/10 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/20"
              >
                {showAvailability ? 'Hide Schedule' : 'Manage Schedule'}
              </button>
            </div>
            
            <div className="mt-4">
              {showAvailability ? (
                <AvailabilityManager />
              ) : (
                <p className="text-sm text-gray-500">
                  Click &apos;Manage Schedule&apos; to set your weekly availability
                </p>
              )}
            </div>
          </section>

          {/* Sessions Section */}
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Sessions
            </h2>
            <SessionManager role="coach" />
          </section>
        </div>
      </main>
    </div>
  );
} 