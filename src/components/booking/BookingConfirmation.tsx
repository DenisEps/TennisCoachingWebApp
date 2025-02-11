'use client';

import { useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Coach {
  id: string;
  email: string;
  full_name: string | null;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface BookingConfirmationProps {
  coach: Coach;
  timeSlot: TimeSlot;
  onConfirm: () => void;
  onCancel: () => void;
  userId: string;
}

export function BookingConfirmation({
  coach,
  timeSlot,
  onConfirm,
  onCancel,
  userId
}: BookingConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: bookingError } = await supabaseAdmin
        .from('sessions')
        .insert({
          coach_id: coach.id,
          client_id: userId,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          status: 'pending'
        });

      if (bookingError) throw bookingError;
      onConfirm();
    } catch (err) {
      console.error('Error booking session:', err);
      setError('Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startTime = formatDateTime(timeSlot.start_time);
  const endTime = formatDateTime(timeSlot.end_time);

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Confirm Your Booking</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please review the details below before confirming your session.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Coach</h4>
          <p className="mt-1 text-gray-900">{coach.full_name || coach.email}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Date</h4>
          <p className="mt-1 text-gray-900">{startTime.date}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Time</h4>
          <p className="mt-1 text-gray-900">
            {startTime.time} - {endTime.time}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1 rounded-md bg-brand-primary px-4 py-2 text-white hover:bg-brand-primary-dark disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Confirm Booking'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 