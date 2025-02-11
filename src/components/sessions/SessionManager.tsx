'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SessionCard } from './SessionCard';

interface Session {
  id: string;
  coach_id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  coach?: {
    full_name: string | null;
    email: string;
  };
  client?: {
    full_name: string | null;
    email: string;
  };
}

export function SessionManager({ role }: { role: 'coach' | 'client' }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseAdmin
        .from('sessions')
        .select(`
          *,
          coach:coach_id(full_name, email),
          client:client_id(full_name, email)
        `)
        .eq(role === 'coach' ? 'coach_id' : 'client_id', user.id)
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;

      setSessions(data || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Unable to load sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCancelSession = async (sessionId: string) => {
    try {
      setIsActionLoading(true);
      setError(null);

      const { error: cancelError } = await supabaseAdmin
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (cancelError) throw cancelError;

      await loadSessions(); // Reload sessions after cancellation
      setMessage({ type: 'success', text: 'Session cancelled successfully' });
    } catch (err) {
      console.error('Error cancelling session:', err);
      setError('Failed to cancel session. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadgeClasses = (status: Session['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'confirmed':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'completed':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'cancelled':
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const isUpcoming = (session: Session) => {
    return new Date(session.start_time) > new Date();
  };

  const upcomingSessions = sessions.filter(s => isUpcoming(s) && s.status !== 'cancelled');
  const pastSessions = sessions.filter(s => !isUpcoming(s) || s.status === 'cancelled');

  return (
    <AsyncWrapper
      isLoading={isLoading}
      error={error}
      onRetry={loadSessions}
      isEmpty={sessions.length === 0}
      emptyMessage="No sessions found"
      loadingMessage="Loading your sessions..."
    >
      <div className="space-y-8">
        {message?.type === 'success' && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">{message.text}</p>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div>
          <h3 className="font-medium text-gray-900">Upcoming Sessions</h3>
          <div className="mt-4 space-y-4">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming sessions</p>
            ) : (
              upcomingSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  role={role}
                  onCancel={handleCancelSession}
                  isActionLoading={isActionLoading}
                />
              ))
            )}
          </div>
        </div>

        {/* Past Sessions */}
        <div>
          <h3 className="font-medium text-gray-900">Past Sessions</h3>
          <div className="mt-4 space-y-4">
            {pastSessions.length === 0 ? (
              <p className="text-sm text-gray-500">No past sessions</p>
            ) : (
              pastSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  role={role}
                  isPast
                />
              ))
            )}
          </div>
        </div>
      </div>
    </AsyncWrapper>
  );
} 