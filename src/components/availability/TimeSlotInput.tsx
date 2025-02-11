'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pencil, Trash2 } from 'lucide-react';

interface TimeSlotInputProps {
  startTime: string;
  endTime: string;
  onDelete: () => Promise<void>;
  onUpdate: (startTime: string, endTime: string) => Promise<void>;
  isEditing?: boolean;
}

export function TimeSlotInput({
  startTime,
  endTime,
  onDelete,
  onUpdate,
  isEditing: initialEditState = false
}: TimeSlotInputProps) {
  const [isEditing, setIsEditing] = useState(initialEditState);
  const [newStartTime, setNewStartTime] = useState(startTime);
  const [newEndTime, setNewEndTime] = useState(endTime);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onUpdate(newStartTime, newEndTime);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update time slot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onDelete();
    } catch (err) {
      setError('Failed to delete time slot');
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
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
              onClick={handleUpdate}
              disabled={isLoading}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <span className="text-sm text-gray-900">
        {startTime} - {endTime}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
          className="inline-flex items-center rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="inline-flex items-center rounded-md p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Delete"
        >
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
} 