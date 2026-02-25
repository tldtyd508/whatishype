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

async function tryFetch(url: string, timeoutMs: number): Promise<{ posts: RedditPost[] } | null> {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
            headers: {
                // Reddit requires a descriptive User-Agent for API access
                'User-Agent': 'web:whatishype:v1.0 (server-side trend aggregator)',
                Accept: 'application/json',
            },
            signal: controller.signal,
            cache: 'no-store',
        });

        clearTimeout(timer);

        if (!res.ok) {
            console.error(`[Reddit] ${url} → HTTP ${res.status} ${res.statusText}`);
            const body = await res.text().catch(() => '(no body)');
            console.error(`[Reddit] Response body: ${body.slice(0, 300)}`);
            return null;
        }

        const data = (await res.json()) as RedditApiResponse;

        if (!data?.data?.children?.length) {
            console.error(`[Reddit] ${url} → empty children`);
            return null;
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

        console.log(`[Reddit] ✓ ${url} → ${posts.length} posts`);
        return { posts };
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[Reddit] ${url} → exception: ${msg}`);
        return null;
    }
}

export async function GET() {
    // Try all endpoints in parallel with short timeout
    const results = await Promise.all([
        tryFetch('https://www.reddit.com/r/popular/hot.json?limit=30&raw_json=1', 5000),
        tryFetch('https://old.reddit.com/r/popular.json?limit=30&raw_json=1', 5000),
        tryFetch('https://www.reddit.com/r/all/hot.json?limit=30&raw_json=1', 5000),
    ]);

    // Use first successful result
    const success = results.find((r) => r !== null);

    if (success) {
        const response: FeedResponse<RedditPost> = {
            posts: success.posts,
            updatedAt: new Date().toISOString(),
        };
        return NextResponse.json(response);
    }

    console.error('[Reddit] All endpoints failed');
    return NextResponse.json(
        { error: 'Reddit 서버에서 차단됨 (Vercel IP)', posts: [], updatedAt: new Date().toISOString() },
        { status: 502 }
    );
}
