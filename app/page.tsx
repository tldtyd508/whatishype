'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import FeedColumn from '@/app/components/FeedColumn';
import DcPostCard from '@/app/components/DcPostCard';
import RedditPostCard from '@/app/components/RedditPostCard';
import type { DcPost, RedditPost, FeedResponse } from '@/app/lib/types';

export default function Home() {
  const [dcPosts, setDcPosts] = useState<DcPost[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [dcLoading, setDcLoading] = useState(true);
  const [redditLoading, setRedditLoading] = useState(true);
  const [dcError, setDcError] = useState<string | null>(null);
  const [redditError, setRedditError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchDc = useCallback(async () => {
    setDcLoading(true);
    setDcError(null);
    try {
      const res = await fetch('/api/dcinside');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<DcPost> = await res.json();
      setDcPosts(data.posts);
      setLastUpdated(data.updatedAt);
    } catch (err) {
      setDcError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setDcLoading(false);
    }
  }, []);

  const fetchReddit = useCallback(async () => {
    setRedditLoading(true);
    setRedditError(null);
    try {
      const res = await fetch('/api/reddit');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<RedditPost> = await res.json();
      setRedditPosts(data.posts);
      setLastUpdated(data.updatedAt);
    } catch (err) {
      setRedditError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRedditLoading(false);
    }
  }, []);

  const fetchAll = useCallback(() => {
    fetchDc();
    fetchReddit();
  }, [fetchDc, fetchReddit]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isLoading = dcLoading || redditLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-[#0a0a1a] dark:to-[#0d0d2b] transition-colors duration-500">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header onRefresh={fetchAll} isLoading={isLoading} lastUpdated={lastUpdated} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Mobile tabs for small screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* DC feed */}
            <FeedColumn
              title="DC 실시간 베스트"
              icon={
                <span className="text-white text-sm font-bold">DC</span>
              }
              accentColor="blue"
              count={dcPosts.length}
              isLoading={dcLoading}
              error={dcError}
            >
              {dcPosts.map((post) => (
                <DcPostCard key={`dc-${post.rank}-${post.link}`} post={post} />
              ))}
            </FeedColumn>

            {/* Reddit feed */}
            <FeedColumn
              title="Reddit Hot"
              icon={
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
              }
              accentColor="orange"
              count={redditPosts.length}
              isLoading={redditLoading}
              error={redditError}
            >
              {redditPosts.map((post) => (
                <RedditPostCard key={`reddit-${post.rank}-${post.permalink}`} post={post} />
              ))}
            </FeedColumn>
          </div>

          {/* Footer */}
          <footer className="mt-12 pb-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              What is Hype? — DC인사이드 × Reddit 실시간 트렌드 대시보드
            </p>
            <p className="text-[10px] text-gray-300 dark:text-gray-700 mt-1">
              데이터는 각 플랫폼에서 실시간으로 수집됩니다
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
