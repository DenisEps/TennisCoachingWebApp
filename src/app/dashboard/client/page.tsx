'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookingManager } from '@/components/booking/BookingManager';
import { SessionManager } from '@/components/sessions/SessionManager';

export default function ClientDashboard() {
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!session || user?.role !== 'client') {
      router.push('/login');
    }
  }, [session, user, router]);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Book Session Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Book a Session</h2>
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showBooking ? 'Hide Booking' : 'Book Now'}
            </button>
          </div>
          
          {showBooking ? (
            <BookingManager />
          ) : (
            <p className="text-gray-600">
              Click 'Book Now' to find available time slots with coaches
            </p>
          )}
        </div>

        {/* Upcoming Sessions Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Your Sessions</h2>
          <SessionManager role="client" />
        </div>
      </div>
    </div>
  );
} 