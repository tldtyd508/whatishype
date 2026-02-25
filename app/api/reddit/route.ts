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
    const urls = [
        'https://www.reddit.com/r/popular/hot.json?limit=30&raw_json=1',
        'https://old.reddit.com/r/popular.json?limit=30&raw_json=1',
    ];

    // Try all in parallel
    const results = await Promise.all(
        urls.map(async (url) => {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 5000);

                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'web:whatishype:v1.0 (server-side trend aggregator)',
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                    cache: 'no-store',
                });
                clearTimeout(timer);

                if (!res.ok) return null;

                const data = (await res.json()) as RedditApiResponse;
                if (!data?.data?.children?.length) return null;

                return data.data.children
                    .filter((child) => !child.data.stickied)
                    .slice(0, 30)
                    .map((child, index) => {
                        const d = child.data;
                        return {
                            rank: index + 1,
                            title: d.title,
                            subreddit: d.subreddit,
                            score: d.score,
                            numComments: d.num_comments,
                            permalink: `https://reddit.com${d.permalink}`,
                            thumbnail: d.thumbnail?.startsWith('http') ? d.thumbnail : undefined,
                        } as RedditPost;
                    });
            } catch {
                return null;
            }
        })
    );

    const posts = results.find((r) => r !== null);

    if (posts) {
        return NextResponse.json({
            posts,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<RedditPost>);
    }

    // Graceful degradation — return 200 with empty data + reason
    return NextResponse.json({
        posts: [],
        updatedAt: new Date().toISOString(),
        blocked: true,
        reason: 'Reddit이 서버 IP를 차단합니다. 로컬 환경에서는 정상 동작합니다.',
    });
}
