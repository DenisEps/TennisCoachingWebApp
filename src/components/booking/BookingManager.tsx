'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';

interface Coach {
  id: string;
  email: string;
  full_name: string | null;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  coachId: string;
}

interface BookingSlot {
  startTime: Date;
  endTime: Date;
  coachId: string;
}

export function BookingManager() {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load coaches
  useEffect(() => {
    const loadCoaches = async () => {
      try {
        console.log('Loading coaches...');
        const { data, error } = await supabaseAdmin
          .from('users')
          .select('id, email, full_name')
          .eq('role', 'coach');

        if (error) throw error;
        
        console.log('Coaches loaded:', data);
        setCoaches(data || []);
      } catch (error) {
        console.error('Error loading coaches:', error);
        setMessage({ type: 'error', text: 'Failed to load coaches' });
      }
    };

    loadCoaches();
  }, []);

  // Helper function to generate time slots
  const generateTimeSlots = (startTime: string, endTime: string, date: string, coachId: string) => {
    const slots: BookingSlot[] = [];
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    // Generate 1-hour slots
    let slotStart = new Date(start);
    while (slotStart < end) {
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // Add 1 hour
      if (slotEnd <= end) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          coachId,
        });
      }
      slotStart = new Date(slotStart.getTime() + 60 * 60 * 1000);
    }
    return slots;
  };

  // Modified useEffect for loading time slots
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedCoach || !selectedDate) return;

      setIsLoading(true);
      try {
        const dayOfWeek = new Date(selectedDate).getDay();
        console.log('Loading slots for coach:', selectedCoach, 'day:', dayOfWeek);
        
        const { data: availabilityData, error: availabilityError } = await supabaseAdmin
          .from('coach_availability')
          .select('*')
          .eq('coach_id', selectedCoach)
          .eq('day_of_week', dayOfWeek);

        if (availabilityError) throw availabilityError;

        console.log('Availability data:', availabilityData);

        if (availabilityData && availabilityData.length > 0) {
          // Generate all possible booking slots
          const allSlots = availabilityData.flatMap(slot => 
            generateTimeSlots(slot.start_time, slot.end_time, selectedDate, slot.coach_id)
          );

          // Check for existing bookings
          const startOfDay = new Date(`${selectedDate}T00:00:00`);
          const endOfDay = new Date(`${selectedDate}T23:59:59`);

          const { data: existingBookings, error: bookingsError } = await supabaseAdmin
            .from('sessions')
            .select('*')
            .eq('coach_id', selectedCoach)
            .gte('start_time', startOfDay.toISOString())
            .lte('end_time', endOfDay.toISOString())
            .not('status', 'eq', 'cancelled');

          if (bookingsError) throw bookingsError;

          // Filter out booked slots
          const availableSlots = allSlots.filter(slot => {
            return !existingBookings?.some(booking => {
              const bookingStart = new Date(booking.start_time);
              const bookingEnd = new Date(booking.end_time);
              return (
                (slot.startTime >= bookingStart && slot.startTime < bookingEnd) ||
                (slot.endTime > bookingStart && slot.endTime <= bookingEnd)
              );
            });
          });

          setBookingSlots(availableSlots);
        } else {
          setBookingSlots([]);
        }
      } catch (error) {
        console.error('Error loading time slots:', error);
        setMessage({ type: 'error', text: 'Failed to load available time slots' });
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableSlots();
  }, [selectedCoach, selectedDate]);

  const formatTimeSlot = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleBooking = async (slot: TimeSlot) => {
    if (!user || !selectedDate) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const startDateTime = new Date(`${selectedDate} ${slot.startTime}`);
      const endDateTime = new Date(`${selectedDate} ${slot.endTime}`);

      console.log('Creating session with:', {
        coach_id: slot.coachId,
        client_id: user.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'pending'
      });

      const { data, error } = await supabaseAdmin
        .from('sessions')
        .insert({
          coach_id: slot.coachId,
          client_id: user.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'pending'
        })
        .select();

      if (error) throw error;

      console.log('Session created:', data);
      setMessage({ type: 'success', text: 'Session booked successfully!' });
    } catch (error) {
      console.error('Error booking session:', error);
      setMessage({ type: 'error', text: 'Failed to book session' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Coach Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Coach
        </label>
        <select
          value={selectedCoach || ''}
          onChange={(e) => setSelectedCoach(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Choose a coach</option>
          {coaches.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.full_name || coach.email}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      {/* Modified Available Time Slots section */}
      {isLoading ? (
        <p>Loading available slots...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Available Time Slots</h3>
          {bookingSlots.length === 0 ? (
            <p className="text-gray-500">No available slots for selected date</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {bookingSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleBooking({
                    startTime: slot.startTime.toLocaleTimeString('en-US', { hour12: false }),
                    endTime: slot.endTime.toLocaleTimeString('en-US', { hour12: false }),
                    coachId: slot.coachId
                  })}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {formatTimeSlot(slot.startTime)} - {formatTimeSlot(slot.endTime)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 