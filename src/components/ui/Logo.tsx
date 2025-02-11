'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizes = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 64, height: 64 },
};

export function Logo({ size = 'medium', className = '' }: LogoProps) {
  const dimensions = sizes[size];
  
  return (
    <Image
      src="/images/logo.png" // We'll need to add the logo file here
      alt="TopTennis Logo"
      {...dimensions}
      className={className}
      priority
    />
  );
} 