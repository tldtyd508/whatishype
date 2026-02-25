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
    // Try multiple Reddit endpoints — some are blocked by datacenter IPs
    const endpoints = [
        'https://www.reddit.com/r/popular/hot.json?limit=30&raw_json=1',
        'https://old.reddit.com/r/popular.json?limit=30&raw_json=1',
    ];

    for (const url of endpoints) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; WhatIsHype/1.0; +https://whatishype.vercel.app)',
                    Accept: 'application/json, text/plain, */*',
                },
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(8000),
            });

            if (!res.ok) {
                console.warn(`Reddit fetch ${url} returned ${res.status}, trying next...`);
                continue;
            }

            const data = (await res.json()) as RedditApiResponse;

            if (!data?.data?.children?.length) {
                console.warn(`Reddit ${url} returned empty children, trying next...`);
                continue;
            }

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
            console.warn(`Reddit fetch ${url} failed:`, error instanceof Error ? error.message : error);
            continue;
        }
    }

    // All endpoints failed
    console.error('All Reddit endpoints failed');
    return NextResponse.json(
        { error: 'Failed to fetch Reddit data', posts: [], updatedAt: new Date().toISOString() },
        { status: 500 }
    );
}
