'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  id: string;
  coach_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  coach?: {
    full_name: string | null;
    email: string;
  };
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const { data, error } = await supabaseAdmin
          .from('news')
          .select(`
            *,
            coach:coach_id(full_name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNews(data || []);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Failed to load news feed');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <AsyncWrapper isLoading={isLoading} error={error}>
      <div className="space-y-6">
        {news.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                {item.coach && (
                  <p className="text-sm text-gray-500">
                    Posted by {item.coach.full_name || item.coach.email}
                  </p>
                )}
              </div>
              <time className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </time>
            </div>
            <p className="mt-3 text-gray-600">
              {item.content}
            </p>
          </article>
        ))}
        {news.length === 0 && (
          <p className="text-center text-gray-500">No news yet</p>
        )}
      </div>
    </AsyncWrapper>
  );
} 