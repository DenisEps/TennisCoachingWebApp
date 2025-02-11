import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface AsyncWrapperProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
}

export function AsyncWrapper({
  isLoading,
  error,
  onRetry,
  children,
}: AsyncWrapperProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return <>{children}</>;
} 