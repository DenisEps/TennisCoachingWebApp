import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface AsyncWrapperProps {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
  loadingMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  showContentWhileLoading?: boolean;
}

export function AsyncWrapper({ 
  isLoading, 
  error, 
  children, 
  onRetry,
  loadingMessage = 'Loading...',
  isEmpty = false,
  emptyMessage = 'No data available',
  showContentWhileLoading = false
}: AsyncWrapperProps) {
  if (error) {
    return (
      <ErrorMessage 
        message={error}
        action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
      />
    );
  }

  if (isEmpty && !isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && !showContentWhileLoading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="default" />
            {loadingMessage && (
              <p className="mt-2 text-sm text-gray-500">{loadingMessage}</p>
            )}
          </div>
        </div>
      )}

      {(showContentWhileLoading || !isLoading) && children}

      {isLoading && showContentWhileLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <LoadingSpinner size="default" />
        </div>
      )}
    </div>
  );
} 