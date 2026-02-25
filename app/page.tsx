'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import TrendCard from '@/app/components/TrendCard';
import XTrends from '@/app/components/XTrends';
import FeedColumn from '@/app/components/FeedColumn';
import GoogleNewsCard from '@/app/components/GoogleNewsCard';
import MelonChartCard from '@/app/components/MelonChartCard';
import type { GoogleTrend, GoogleNewsPost, MelonSong, XTrend, FeedResponse } from '@/app/lib/types';

export default function Home() {
  // Google Trends
  const [trends, setTrends] = useState<GoogleTrend[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  // X Trends
  const [xTrends, setXTrends] = useState<XTrend[]>([]);
  const [xLoading, setXLoading] = useState(true);
  const [xError, setXError] = useState<string | null>(null);

  // Google News
  const [newsPosts, setNewsPosts] = useState<GoogleNewsPost[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Melon Chart
  const [melonSongs, setMelonSongs] = useState<MelonSong[]>([]);
  const [melonLoading, setMelonLoading] = useState(true);
  const [melonError, setMelonError] = useState<string | null>(null);

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

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res = await fetch('/api/google-news');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<GoogleNewsPost> = await res.json();
      if (data.blocked) {
        setNewsError(`[접근 제한] ${data.reason}`);
      }
      setNewsPosts(data.posts.slice(0, 10)); // Top 10 for layout balance
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : '오류');
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const fetchMelon = useCallback(async () => {
    setMelonLoading(true);
    setMelonError(null);
    try {
      const res = await fetch('/api/melon');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedResponse<MelonSong> = await res.json();
      if (data.blocked) {
        setMelonError(`[접근 제한] ${data.reason}`);
      }
      setMelonSongs(data.posts.slice(0, 10)); // Top 10 for layout balance
    } catch (err) {
      setMelonError(err instanceof Error ? err.message : '오류');
    } finally {
      setMelonLoading(false);
    }
  }, []);

  const fetchAll = useCallback(() => {
    fetchTrends();
    fetchXTrends();
    fetchNews();
    fetchMelon();
  }, [fetchTrends, fetchXTrends, fetchNews, fetchMelon]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isLoading = trendsLoading || xLoading || newsLoading || melonLoading;

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
              <div className="lg:col-span-3 lg:border-r lg:border-gray-200/50 lg:dark:border-gray-800/50 lg:pr-6">
                <XTrends
                  trends={xTrends}
                  isLoading={xLoading}
                  error={xError}
                />
              </div>

              {/* Realtime Hype Feeds */}
              <div className="lg:col-span-9">
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">📰</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">실시간 Hype</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">종합 뉴스 & 음원</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Google News Feed */}
                  <FeedColumn
                    title="주요 뉴스"
                    icon={<span className="text-white text-sm font-bold">GN</span>}
                    accentColor="blue"
                    count={newsPosts.length}
                    isLoading={newsLoading}
                    error={newsError}
                  >
                    {newsPosts.map((post) => (
                      <GoogleNewsCard key={`news-${post.rank}`} post={post} />
                    ))}
                  </FeedColumn>

                  {/* Melon Chart Feed */}
                  <FeedColumn
                    title="Melon 차트 Top 10"
                    icon={<span className="text-white text-sm font-bold">🎵</span>}
                    accentColor="emerald"
                    count={melonSongs.length}
                    isLoading={melonLoading}
                    error={melonError}
                  >
                    {melonSongs.map((post) => (
                      <MelonChartCard key={`melon-${post.rank}`} post={post} />
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
              Google Trends · Google News · X (Twitter) · Melon
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
