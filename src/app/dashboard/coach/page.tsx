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
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coach Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Availability Management Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Availability</h2>
            <button
              type="button"
              onClick={handleManageSchedule}
              className="rounded px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              {showAvailability ? 'Hide Schedule' : 'Manage Schedule'}
            </button>
          </div>
          
          <div className="mt-4">
            {showAvailability ? (
              <AvailabilityManager />
            ) : (
              <p className="text-gray-600">
                Click 'Manage Schedule' to set your weekly availability
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Sessions Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Sessions</h2>
          <SessionManager role="coach" />
        </div>
      </div>
    </div>
  );
} 