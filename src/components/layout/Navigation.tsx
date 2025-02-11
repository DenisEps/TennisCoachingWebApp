'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Clock, Calendar } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const links: NavLink[] = [
  { 
    href: '/news', 
    label: 'News',
    icon: <Newspaper className="h-6 w-6" />
  },
  { 
    href: '/sessions', 
    label: 'Sessions',
    icon: <Clock className="h-6 w-6" />
  },
  { 
    href: '/availability', 
    label: 'Availability',
    icon: <Calendar className="h-6 w-6" />
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4">
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`
            flex flex-col items-center space-y-1 transition-all duration-200 ease-in-out
            ${pathname === href
              ? 'text-[#D4B982]'
              : 'text-white/90 hover:text-[#D4B982]/90'
            }
          `}
        >
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
} 