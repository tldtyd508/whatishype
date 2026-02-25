'use client';

import React from 'react';
import type { MelonSong } from '@/app/lib/types';

interface MelonChartCardProps {
    post: MelonSong;
}

export default function MelonChartCard({ post }: MelonChartCardProps) {
    return (
        <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-inner shadow-emerald-500/10 dark:shadow-emerald-900/50">
                {post.rank}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                    {post.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {post.artist}
                </p>
            </div>

            <a
                href={`https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="멜론에서 검색"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </a>
        </div>
    );
}
