import { NextResponse } from 'next/server';
import type { RedditPost, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

interface RedditChild {
    data: {
        title: string;
        subreddit: string;
        score: number;
        num_comments: number;
        permalink: string;
        thumbnail?: string;
        stickied?: boolean;
        over_18?: boolean;
    };
}

interface RedditApiResponse {
    data: {
        children: RedditChild[];
    };
}

export async function GET() {
    try {
        const res = await fetch('https://old.reddit.com/r/popular.json?limit=30&raw_json=1', {
            headers: {
                'User-Agent': 'WhatIsHype/1.0 (Next.js Server-Side; contact: dev@example.com)',
                Accept: 'application/json',
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            throw new Error(`Reddit fetch failed: ${res.status}`);
        }

        const data = (await res.json()) as RedditApiResponse;

        const posts: RedditPost[] = data.data.children
            .filter((child) => !child.data.stickied)
            .slice(0, 30)
            .map((child, index) => {
                const d = child.data;
                const thumbnail =
                    d.thumbnail && d.thumbnail.startsWith('http') ? d.thumbnail : undefined;

                return {
                    rank: index + 1,
                    title: d.title,
                    subreddit: d.subreddit,
                    score: d.score,
                    numComments: d.num_comments,
                    permalink: `https://reddit.com${d.permalink}`,
                    thumbnail,
                };
            });

        const response: FeedResponse<RedditPost> = {
            posts,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Reddit API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Reddit data', posts: [], updatedAt: new Date().toISOString() },
            { status: 500 }
        );
    }
}
