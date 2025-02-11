'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useAuth } from '@/contexts/AuthContext';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      console.log('Loading sessions for:', {
        role,
        userId: user.id
      });

      const { data, error } = await supabaseAdmin
        .from('sessions')
        .select(`
          *,
          coach:coach_id(full_name, email),
          client:client_id(full_name, email)
        `)
        .eq(role === 'coach' ? 'coach_id' : 'client_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;

      console.log('Sessions loaded:', data);
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setMessage({ type: 'error', text: 'Failed to load sessions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Session cancelled successfully' });
      loadSessions(); // Reload sessions to update the list
    } catch (error) {
      console.error('Error cancelling session:', error);
      setMessage({ type: 'error', text: 'Failed to cancel session' });
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (session: Session) => {
    return new Date(session.start_time) > new Date();
  };

  if (isLoading) return <div>Loading sessions...</div>;

  const upcomingSessions = sessions.filter(s => isUpcoming(s) && s.status !== 'cancelled');
  const pastSessions = sessions.filter(s => !isUpcoming(s) || s.status === 'cancelled');

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upcoming Sessions */}
      <div>
        <h3 className="font-medium text-lg mb-4">Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions</p>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {role === 'coach' 
                        ? `Client: ${session.client?.full_name || session.client?.email}`
                        : `Coach: ${session.coach?.full_name || session.coach?.email}`
                      }
                    </p>
                    <p className="text-gray-600">
                      {formatDateTime(session.start_time)} - {new Date(session.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500">Status: {session.status}</p>
                  </div>
                  {session.status === 'pending' && (
                    <button
                      onClick={() => handleCancelSession(session.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h3 className="font-medium text-lg mb-4">Past Sessions</h3>
        {pastSessions.length === 0 ? (
          <p className="text-gray-500">No past sessions</p>
        ) : (
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 space-y-2 bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {role === 'coach'
                      ? `Client: ${session.client?.full_name || session.client?.email}`
                      : `Coach: ${session.coach?.full_name || session.coach?.email}`
                    }
                  </p>
                  <p className="text-gray-600">
                    {formatDateTime(session.start_time)} - {new Date(session.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-500">Status: {session.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 