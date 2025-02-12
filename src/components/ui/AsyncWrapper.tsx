import { LoadingSpinner } from './LoadingSpinner';

interface AsyncWrapperProps {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  loadingMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  showContentWhileLoading?: boolean;
}

export function AsyncWrapper({ 
  isLoading, 
  error, 
  children, 
  loadingMessage = 'Loading...',
  isEmpty = false,
  emptyMessage = 'No data available',
  showContentWhileLoading = false
}: AsyncWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-brand-primary">
        <LoadingSpinner />
        {loadingMessage && <p className="ml-2">{loadingMessage}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-8 text-center">
        <p className="text-brand-primary">{emptyMessage}</p>
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