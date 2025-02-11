'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { generateAvailableTimeSlots } from './utils/timeSlots';

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface TimeSlotSelectorProps {
  coachId: string;
  onSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

export function TimeSlotSelector({ coachId, onSelect, selectedSlot }: TimeSlotSelectorProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get coach's availability
        const { data: availabilityData, error: availabilityError } = await supabaseAdmin
          .from('coach_availability')
          .select('*')
          .eq('coach_id', coachId);

        if (availabilityError) throw availabilityError;

        // Get existing sessions
        const { data: sessionsData, error: sessionsError } = await supabaseAdmin
          .from('sessions')
          .select('start_time, end_time')
          .eq('coach_id', coachId)
          .gte('start_time', new Date().toISOString())
          .neq('status', 'cancelled');

        if (sessionsError) throw sessionsError;

        // Generate available time slots based on availability and existing sessions
        const slots = generateAvailableTimeSlots(availabilityData, sessionsData);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error loading time slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableSlots();
  }, [coachId]);

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    
    return {
      date: start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: `${start.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${end.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    };
  };

  const isSlotSelected = (slot: TimeSlot) => 
    selectedSlot?.start_time === slot.start_time && 
    selectedSlot?.end_time === slot.end_time;

  return (
    <AsyncWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={availableSlots.length === 0}
      emptyMessage="No available time slots found"
      loadingMessage="Loading available time slots..."
    >
      <div className="grid gap-3">
        {availableSlots.map((slot) => {
          const { date, time } = formatTimeSlot(slot);
          return (
            <button
              key={slot.start_time}
              onClick={() => onSelect(slot)}
              className={`flex flex-col rounded-lg border p-4 text-left transition-colors ${
                isSlotSelected(slot)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="font-medium text-gray-900">{date}</span>
              <span className="text-sm text-gray-500">{time}</span>
            </button>
          );
        })}
      </div>
    </AsyncWrapper>
  );
} 