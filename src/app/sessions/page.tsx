'use client';

import { SessionManager } from '@/components/sessions/SessionManager';
import { useAuth } from '@/contexts/AuthContext';

export default function SessionsPage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">My Sessions</h1>
      <SessionManager role={user?.role || 'client'} />
    </div>
  );
} 