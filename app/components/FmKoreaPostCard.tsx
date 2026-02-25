'use client';

import React from 'react';
import type { FmKoreaPost } from '@/app/lib/types';

interface FmKoreaPostCardProps {
    post: FmKoreaPost;
}

export default function FmKoreaPostCard({ post }: FmKoreaPostCardProps) {
    return (
        <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shadow-inner shadow-blue-500/10 dark:shadow-blue-900/50">
                {post.rank}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {post.title}
                </h3>

                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 dark:text-gray-400">
                    {post.category && (
                        <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                            {post.category}
                        </span>
                    )}
                    <span className="truncate">{post.author}</span>
                </div>
            </div>
        </a>
    );
}
