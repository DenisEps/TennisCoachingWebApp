import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

interface SessionCardProps {
  session: Session;
  role: 'coach' | 'client';
  onCancel?: (sessionId: string) => void;
  isActionLoading?: boolean;
  isPast?: boolean;
}

export function SessionCard({ 
  session, 
  role, 
  onCancel, 
  isActionLoading,
  isPast = false 
}: SessionCardProps) {
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

  const { date, time } = formatDateTime(session.start_time);

  return (
    <div className={`rounded-lg border border-gray-200 p-4 ${
      isPast ? 'bg-gray-50' : 'bg-white shadow-sm'
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">
            {role === 'coach'
              ? `Client: ${session.client?.full_name || session.client?.email}`
              : `Coach: ${session.coach?.full_name || session.coach?.email}`
            }
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{date}</span>
            <span>•</span>
            <span>{time}</span>
          </div>
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClasses(session.status)}`}>
            {session.status}
          </span>
        </div>
        {!isPast && session.status === 'pending' && onCancel && (
          <button
            onClick={() => onCancel(session.id)}
            disabled={isActionLoading}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isActionLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              'Cancel'
            )}
          </button>
        )}
      </div>
    </div>
  );
} 