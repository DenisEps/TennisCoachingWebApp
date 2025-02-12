'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Home,
  UserCircle, 
  Clock,
  PlusCircle,
  Newspaper
} from 'lucide-react';

export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isCoach = user?.role === 'coach';

  // Don't render navigation on login page or when user is not logged in
  if (!user || pathname === '/login') {
    return null;
  }

  const commonItems = [
    {
      label: 'News',
      href: '/news',
      icon: Newspaper,
    },
  ];

  const coachItems = [
    {
      label: 'Schedule',
      href: '/dashboard/coach',
      icon: Calendar,
    },
    {
      label: 'Sessions',
      href: '/sessions',
      icon: Clock,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserCircle,
    },
  ];

  const clientItems = [
    {
      label: 'Home',
      href: '/dashboard/client',
      icon: Home,
    },
    {
      label: 'Sessions',
      href: '/sessions',
      icon: Clock,
    },
    {
      label: 'Book',
      href: '/book',
      icon: PlusCircle,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserCircle,
    },
  ];

  const navItems = isCoach 
    ? [...commonItems, ...coachItems] 
    : [...commonItems, ...clientItems];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe">
      <div className="mx-auto flex max-w-md justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ease-in-out ${
                isActive 
                  ? 'text-[#D4B982] scale-110' 
                  : 'text-gray-600 hover:text-[#D4B982] hover:scale-105'
              }`}
            >
              <Icon className={`h-6 w-6 transition-transform duration-200 ${
                isActive ? 'scale-110' : ''
              }`} />
              <span className={`text-xs transition-all duration-200 ${
                isActive ? 'font-medium' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 