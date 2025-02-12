'use client';

import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/news');
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default LoginForm; 