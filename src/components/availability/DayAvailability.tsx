'use client';

import { useState } from 'react';
import { TimeSlotInput } from './TimeSlotInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
}

interface DayAvailabilityProps {
  dayName: string;
  dayOfWeek: number;
  slots: TimeSlot[];
  onAddSlot: (startTime: string, endTime: string) => Promise<void>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<void>;
  onDeleteSlot: (id: string) => Promise<void>;
}

export function DayAvailability({
  dayName,
  dayOfWeek,
  slots,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}: DayAvailabilityProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('17:00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSlot = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onAddSlot(newStartTime, newEndTime);
      setIsAdding(false);
      setNewStartTime('09:00');
      setNewEndTime('17:00');
    } catch (err) {
      setError('Failed to add time slot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{dayName}</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-brand-primary hover:text-brand-primary-dark"
        >
          Add Time Slot
        </button>
      </div>

      {isAdding && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
              disabled={isLoading}
            />
            <span className="self-center">-</span>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
              disabled={isLoading}
            />
            <div className="flex gap-1">
              <button
                onClick={handleAddSlot}
                disabled={isLoading}
                className="rounded-md bg-brand-primary px-3 py-2 text-sm text-white hover:bg-brand-primary-dark disabled:opacity-50"
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Save'}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                disabled={isLoading}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      <div className="space-y-2">
        {slots.map((slot) => (
          <TimeSlotInput
            key={slot.id}
            startTime={slot.start_time}
            endTime={slot.end_time}
            onDelete={() => onDeleteSlot(slot.id)}
            onUpdate={(startTime, endTime) => 
              onUpdateSlot(slot.id, startTime, endTime)
            }
          />
        ))}
      </div>
    </div>
  );
} 