'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';

interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export function AvailabilityManager() {
  console.log('AvailabilityManager rendering');
  
  const { user, session } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Load existing availability
  useEffect(() => {
    const loadAvailability = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabaseAdmin
          .from('coach_availability')
          .select('*')
          .eq('coach_id', user.id);

        if (error) throw error;

        if (data) {
          setSlots(data.map(slot => ({
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
          })));
        }
      } catch (error) {
        console.error('Error loading availability:', error);
        setMessage({ type: 'error', text: 'Failed to load availability' });
      }
    };

    loadAvailability();
  }, [user]);

  // Validate time slots
  const validateSlots = () => {
    for (const slot of slots) {
      if (slot.startTime >= slot.endTime) {
        setMessage({ 
          type: 'error', 
          text: 'End time must be after start time for all slots' 
        });
        return false;
      }
    }
    return true;
  };

  const addTimeSlot = (dayOfWeek: number) => {
    setSlots([
      ...slots,
      {
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
      },
    ]);
  };

  const updateSlot = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const saveAvailability = async () => {
    if (!user) return;
    if (!validateSlots()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Delete existing availability
      const { error: deleteError } = await supabaseAdmin
        .from('coach_availability')
        .delete()
        .eq('coach_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new availability
      const { error: insertError } = await supabaseAdmin
        .from('coach_availability')
        .insert(
          slots.map((slot) => ({
            coach_id: user.id,
            day_of_week: slot.dayOfWeek,
            start_time: slot.startTime,
            end_time: slot.endTime,
          }))
        );

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Availability saved successfully' });
    } catch (error) {
      console.error('Error saving availability:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to save availability. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 border border-gray-200 p-4 rounded">
      {message && (
        <div className={`p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {daysOfWeek.map((day, index) => (
          <div key={day} className="space-y-2 p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{day}</h3>
              <button
                onClick={() => addTimeSlot(index)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Add Time Slot
              </button>
            </div>
            {slots
              .filter((slot) => slot.dayOfWeek === index)
              .map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center space-x-4">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(slotIndex, 'startTime', e.target.value)
                    }
                    className="rounded border p-2"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateSlot(slotIndex, 'endTime', e.target.value)
                    }
                    className="rounded border p-2"
                  />
                  <button
                    onClick={() => removeSlot(slotIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <button
        onClick={saveAvailability}
        disabled={isLoading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  );
} 