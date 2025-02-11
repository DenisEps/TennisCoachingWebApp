'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';

interface Coach {
  id: string;
  email: string;
  full_name: string | null;
}

interface CoachSelectorProps {
  onSelect: (coach: Coach) => void;
  selectedCoachId?: string;
}

export function CoachSelector({ onSelect, selectedCoachId }: CoachSelectorProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabaseAdmin
          .from('users')
          .select('id, email, full_name')
          .eq('role', 'coach');

        if (fetchError) throw fetchError;
        setCoaches(data || []);
      } catch (err) {
        console.error('Error loading coaches:', err);
        setError('Failed to load coaches. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoaches();
  }, []);

  return (
    <AsyncWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={coaches.length === 0}
      emptyMessage="No coaches available at the moment"
      loadingMessage="Loading available coaches..."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {coaches.map((coach) => (
          <button
            key={coach.id}
            onClick={() => onSelect(coach)}
            className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
              selectedCoachId === coach.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="text-left">
              <h3 className="font-medium text-gray-900">
                {coach.full_name || 'Coach'}
              </h3>
              <p className="text-sm text-gray-500">{coach.email}</p>
            </div>
          </button>
        ))}
      </div>
    </AsyncWrapper>
  );
} 