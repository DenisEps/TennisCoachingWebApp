import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    // ... existing code ...
    router.push('/news');
  };

  return (
    // ... rest of the component code ...
  );
};

export default LoginForm; 