'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { DayAvailability } from './DayAvailability';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';

interface TimeSlot {
  id: string;
  coach_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = [
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 0 },
];

export function AvailabilityManager() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const loadAvailability = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseAdmin
        .from('coach_availability')
        .select('*')
        .eq('coach_id', user.id)
        .order('day_of_week')
        .order('start_time');

      if (fetchError) throw fetchError;
      setSlots(data || []);
    } catch (err) {
      console.error('Error loading availability:', err);
      setError('Failed to load availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    if (!user) return;

    try {
      const { error: addError } = await supabaseAdmin
        .from('coach_availability')
        .insert({
          coach_id: user.id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime
        });

      if (addError) throw addError;

      await loadAvailability();
      setMessage({ type: 'success', text: 'Time slot added successfully' });
    } catch (err) {
      console.error('Error adding time slot:', err);
      throw new Error('Failed to add time slot');
    }
  };

  const handleUpdateSlot = async (id: string, startTime: string, endTime: string) => {
    try {
      const { error: updateError } = await supabaseAdmin
        .from('coach_availability')
        .update({
          start_time: startTime,
          end_time: endTime
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await loadAvailability();
      setMessage({ type: 'success', text: 'Time slot updated successfully' });
    } catch (err) {
      console.error('Error updating time slot:', err);
      throw new Error('Failed to update time slot');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      const { error: deleteError } = await supabaseAdmin
        .from('coach_availability')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadAvailability();
      setMessage({ type: 'success', text: 'Time slot deleted successfully' });
    } catch (err) {
      console.error('Error deleting time slot:', err);
      throw new Error('Failed to delete time slot');
    }
  };

  return (
    <AsyncWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={slots.length === 0}
      emptyMessage="No availability set. Add your available time slots below."
      loadingMessage="Loading availability..."
    >
      <div className="space-y-6">
        {message && (
          <div className={`rounded-md p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {DAYS.map((day) => (
          <DayAvailability
            key={day.value}
            dayName={day.name}
            dayOfWeek={day.value}
            slots={slots.filter(slot => slot.day_of_week === day.value)}
            onAddSlot={(startTime, endTime) => 
              handleAddSlot(day.value, startTime, endTime)
            }
            onUpdateSlot={handleUpdateSlot}
            onDeleteSlot={handleDeleteSlot}
          />
        ))}
      </div>
    </AsyncWrapper>
  );
} 