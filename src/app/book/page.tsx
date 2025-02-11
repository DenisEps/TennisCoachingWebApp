'use client';

import { BookingManager } from '@/components/booking/BookingManager';

export default function BookPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Book a Session</h1>
      <BookingManager />
    </div>
  );
} 