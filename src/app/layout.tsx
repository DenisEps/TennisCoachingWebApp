import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { MobileNav } from '@/components/navigation/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tennis Coaching App',
  description: 'Book tennis coaching sessions easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="pb-20">
            {children}
          </main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
} 