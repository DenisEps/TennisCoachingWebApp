'use client';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/news');
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
} 