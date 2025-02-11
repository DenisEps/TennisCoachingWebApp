'use client';

import { NewsFeed } from '@/components/news/NewsFeed';

export default function NewsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">News & Announcements</h1>
      <NewsFeed />
    </div>
  );
} 