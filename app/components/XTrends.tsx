'use client';

import React from 'react';
import type { XTrend } from '@/app/lib/types';

interface XTrendsProps {
    trends: XTrend[];
    isLoading: boolean;
    error: string | null;
}

export default function XTrends({ trends, isLoading, error }: XTrendsProps) {
    return (
        <div className="flex flex-col h-full rounded-3xl bg-white/40 dark:bg-[#12122a]/40 border border-white/40 dark:border-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center shadow-lg">
                    {/* X Logo */}
                    <svg className="w-4 h-4 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">X 실시간 트렌드</h2>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">@Korea Top 10</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isLoading && !error && (
                    <div className="space-y-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-800" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                                    <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <p className="text-xs text-red-500 dark:text-red-400 mb-2 font-medium">데이터 접근 제한</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{error}</p>
                    </div>
                )}

                {!isLoading && !error && trends.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400">
                        트렌드가 없습니다
                    </div>
                )}

                {!isLoading && !error && trends.length > 0 && (
                    <ul className="space-y-3">
                        {trends.map((trend) => (
                            <li
                                key={trend.rank}
                                className="group flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => window.open(`https://x.com/search?q=${encodeURIComponent(trend.keyword)}`, '_blank')}
                            >
                                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-md
                                    ${trend.rank <= 3
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}
                                `}>
                                    {trend.rank}
                                </span>

                                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[20px]">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                                        {trend.keyword}
                                    </span>
                                    {trend.tweetCount && (
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                            {trend.tweetCount} 트윗
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
