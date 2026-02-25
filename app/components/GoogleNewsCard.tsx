'use client';

import React from 'react';
import type { GoogleNewsPost } from '@/app/lib/types';

interface GoogleNewsCardProps {
    post: GoogleNewsPost;
}

export default function GoogleNewsCard({ post }: GoogleNewsCardProps) {
    return (
        <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1.5 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    {post.source}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {post.time}
                </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug line-clamp-2">
                {post.title}
            </h3>
        </a>
    );
}
