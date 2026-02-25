'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import TrendCard from '@/app/components/TrendCard';
import NamuRanking from '@/app/components/NamuRanking';
import XTrends from '@/app/components/XTrends';
import FeedColumn from '@/app/components/FeedColumn';
import DcPostCard from '@/app/components/DcPostCard';
import RedditPostCard from '@/app/components/RedditPostCard';
import type { GoogleTrend, NamuKeyword, DcPost, RedditPost, XTrend, FeedResponse } from '@/app/lib/types';

export default function Home() {
  // Google Trends
  const [trends, setTrends] = useState<GoogleTrend[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  // NamuWiki
  const [namuKeywords, setNamuKeywords] = useState<NamuKeyword[]>([]);
  const [namuLoading, setNamuLoading] = useState(true);
  const [namuError, setNamuError] = useState<string | null>(null);

  // X Trends
  const [xTrends, setXTrends] = useState<XTrend[]>([]);
  const [xLoading, setXLoading] = useState(true);
  const [xError, setXError] = useState<string | null>(null);

  // DC
  const [dcPosts, setDcPosts] = useState<DcPost[]>([]);
  const [dcLoading, setDcLoading] = useState(true);
  const [dcError, setDcError] = useState<string | null>(null);

  // Reddit
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [redditLoading, setRedditLoading] = useState(true);
  const [redditError, setRedditError] = useState<string | null>(null);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    setTrendsLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch('/api/google-trends');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<GoogleTrend> = await res.json();
      setTrends(data.posts);
      setLastUpdated(data.updatedAt);
    } catch (err) {
      setTrendsError(err instanceof Error ? err.message : '오류');
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  const fetchNamu = useCallback(async () => {
    setNamuLoading(true);
    setNamuError(null);
    try {
      const res = await fetch('/api/namuwiki');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<NamuKeyword> = await res.json();
      if (data.blocked) {
        setNamuError(`[접근 제한] ${data.reason}`);
      }
      setNamuKeywords(data.posts);
    } catch (err) {
      setNamuError(err instanceof Error ? err.message : '오류');
    } finally {
      setNamuLoading(false);
    }
  }, []);

  const fetchXTrends = useCallback(async () => {
    setXLoading(true);
    setXError(null);
    try {
      const res = await fetch('/api/x-trends');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<XTrend> = await res.json();
      if (data.blocked) {
        setXError(`[접근 제한] ${data.reason}`);
      }
      setXTrends(data.posts);
    } catch (err) {
      setXError(err instanceof Error ? err.message : '오류');
    } finally {
      setXLoading(false);
    }
  }, []);

  const fetchDc = useCallback(async () => {
    setDcLoading(true);
    setDcError(null);
    try {
      const res = await fetch('/api/dcinside');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<DcPost> = await res.json();
      setDcPosts(data.posts.slice(0, 10));
    } catch (err) {
      setDcError(err instanceof Error ? err.message : '오류');
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
      if (data.blocked) {
        setRedditError(`[접근 제한] ${data.reason}`);
      }
      setRedditPosts(data.posts.slice(0, 10));
    } catch (err) {
      setRedditError(err instanceof Error ? err.message : '오류');
    } finally {
      setRedditLoading(false);
    }
  }, []);

  const fetchAll = useCallback(() => {
    fetchTrends();
    fetchNamu();
    fetchXTrends();
    fetchDc();
    fetchReddit();
  }, [fetchTrends, fetchNamu, fetchXTrends, fetchDc, fetchReddit]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isLoading = trendsLoading || namuLoading || xLoading || dcLoading || redditLoading;

  // Determine card sizes based on traffic
  const getCardSize = (trend: GoogleTrend): 'large' | 'medium' | 'small' => {
    const traffic = parseInt(trend.traffic.replace(/[^0-9]/g, ''), 10);
    if (trend.rank <= 2 || traffic >= 2000) return 'large';
    if (trend.rank <= 5 || traffic >= 500) return 'medium';
    return 'small';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-[#0a0a1a] dark:to-[#0d0d2b] transition-colors duration-500">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-pink-400/10 dark:bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header onRefresh={fetchAll} isLoading={isLoading} lastUpdated={lastUpdated} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* ===== Section 1: Google Trends Hero ===== */}
          <section className="mb-8">
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <span className="text-white text-sm">🇰🇷</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Google Trends</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500">실시간 급상승</span>
              {trends.length > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/15 text-violet-500 dark:text-violet-400">
                  {trends.length}
                </span>
              )}
            </div>

            {trendsLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/40 dark:bg-white/[0.03] border border-white/20 dark:border-white/5 p-5 animate-pulse">
                    <div className="flex justify-between mb-3">
                      <div className="w-7 h-7 rounded-lg bg-white/20 dark:bg-white/5" />
                      <div className="w-12 h-4 rounded-full bg-white/20 dark:bg-white/5" />
                    </div>
                    <div className="h-5 w-3/4 rounded bg-white/20 dark:bg-white/5 mb-3" />
                    <div className="h-3 w-full rounded bg-white/10 dark:bg-white/[0.03]" />
                  </div>
                ))}
              </div>
            )}

            {trendsError && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                <div className="text-red-400 text-sm font-medium">Google Trends를 불러올 수 없습니다</div>
              </div>
            )}

            {!trendsLoading && !trendsError && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {trends.map((trend) => (
                  <TrendCard
                    key={`trend-${trend.rank}`}
                    trend={trend}
                    size={getCardSize(trend)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ===== Section 2: Trends + Community Feeds ===== */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* X Trends Sidebar */}
              <div className="lg:col-span-3">
                <XTrends
                  trends={xTrends}
                  isLoading={xLoading}
                  error={xError}
                />
              </div>

              {/* NamuWiki Sidebar */}
              <div className="lg:col-span-3">
                <NamuRanking
                  keywords={namuKeywords}
                  isLoading={namuLoading}
                  error={namuError}
                />
              </div>

              {/* Community Feeds */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">💬</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">커뮤니티 Hype</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">실시간 인기글</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DC Feed */}
                  <FeedColumn
                    title="DC 실시간 베스트"
                    icon={<span className="text-white text-sm font-bold">DC</span>}
                    accentColor="blue"
                    count={dcPosts.length}
                    isLoading={dcLoading}
                    error={dcError}
                  >
                    {dcPosts.map((post) => (
                      <DcPostCard key={`dc-${post.rank}-${post.link}`} post={post} />
                    ))}
                  </FeedColumn>

                  {/* Reddit Feed */}
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
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pb-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              What is Hype? — 지금 이 순간, 인터넷이 뜨거워하는 것들
            </p>
            <p className="text-[10px] text-gray-300 dark:text-gray-700 mt-1">
              Google Trends · X (Twitter) · 나무위키 · DC인사이드 · Reddit
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
