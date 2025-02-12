'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CoachSelector } from './CoachSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { BookingConfirmation } from './BookingConfirmation';

interface Coach {
  id: string;
  email: string;
  full_name: string | null;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

export function BookingManager() {
  const { user } = useAuth();
  const [step, setStep] = useState<'coach' | 'time' | 'confirm'>('coach');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>(undefined);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleCoachSelect = (coach: Coach) => {
    setSelectedCoach(coach);
    setStep('time');
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setStep('confirm');
  };

  const handleConfirm = () => {
    setBookingComplete(true);
  };

  const handleCancel = () => {
    if (step === 'time') {
      setStep('coach');
      setSelectedCoach(null);
    } else if (step === 'confirm') {
      setStep('time');
      setSelectedTimeSlot(undefined);
    }
  };

  const handleStartOver = () => {
    setStep('coach');
    setSelectedCoach(null);
    setSelectedTimeSlot(undefined);
    setBookingComplete(false);
  };

  if (bookingComplete) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">Booking Successful!</h3>
        <p className="mt-2 text-gray-600">
          Your session has been booked. You can view it in your sessions list.
        </p>
        <button
          onClick={handleStartOver}
          className="mt-4 rounded-md bg-brand-primary px-4 py-2 text-white hover:bg-brand-primary-dark"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 'coach' && (
        <>
          <h2 className="text-lg font-medium text-gray-900">Select a Coach</h2>
          <CoachSelector
            onSelect={handleCoachSelect}
            selectedCoachId={selectedCoach?.id}
          />
        </>
      )}

      {step === 'time' && selectedCoach && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Select a Time</h2>
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Change Coach
            </button>
          </div>
          <TimeSlotSelector
            coachId={selectedCoach.id}
            onSelect={handleTimeSelect}
            selectedSlot={selectedTimeSlot}
          />
        </>
      )}

      {step === 'confirm' && selectedCoach && selectedTimeSlot && user && (
        <BookingConfirmation
          coach={selectedCoach}
          timeSlot={selectedTimeSlot}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          userId={user.id}
        />
      )}
    </div>
  );
} 