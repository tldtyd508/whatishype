import { NextResponse } from 'next/server';
import type { NamuKeyword, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Try multiple approaches to fetch NamuWiki ranking
    const endpoints = [
        'https://search.namu.wiki/api/ranking',
        'https://namu.wiki/api/ranking',
    ];

    for (const url of endpoints) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    Accept: 'application/json, text/plain, */*',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    Referer: 'https://namu.wiki/',
                    Origin: 'https://namu.wiki',
                },
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(8000),
            });

            if (!res.ok) {
                console.warn(`NamuWiki ${url} returned ${res.status}, trying next...`);
                continue;
            }

            const contentType = res.headers.get('content-type') || '';
            const text = await res.text();

            // Try to parse as JSON
            let keywords: string[];
            try {
                keywords = JSON.parse(text);
            } catch {
                console.warn(`NamuWiki ${url} returned non-JSON:`, text.slice(0, 200));
                continue;
            }

            if (!Array.isArray(keywords) || keywords.length === 0) {
                console.warn(`NamuWiki ${url} returned empty/invalid data:`, contentType);
                continue;
            }

            const posts: NamuKeyword[] = keywords.map((keyword, index) => ({
                rank: index + 1,
                keyword,
            }));

            const response: FeedResponse<NamuKeyword> = {
                posts,
                updatedAt: new Date().toISOString(),
            };

            return NextResponse.json(response);
        } catch (error) {
            console.warn(`NamuWiki ${url} failed:`, error instanceof Error ? error.message : error);
            continue;
        }
    }

    // All attempts failed — try scraping namu.wiki main page as last resort
    try {
        const res = await fetch('https://namu.wiki', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9',
            },
            signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
            const html = await res.text();
            // Try to find ranking data in the HTML
            const rankingMatch = html.match(/ranking["\s]*:\s*(\[.*?\])/);
            if (rankingMatch) {
                try {
                    const keywords: string[] = JSON.parse(rankingMatch[1]);
                    const posts: NamuKeyword[] = keywords.map((keyword, index) => ({
                        rank: index + 1,
                        keyword,
                    }));
                    return NextResponse.json({
                        posts,
                        updatedAt: new Date().toISOString(),
                    } as FeedResponse<NamuKeyword>);
                } catch {
                    // ignore parse error
                }
            }
        }
    } catch {
        // ignore fallback error
    }

    console.error('All NamuWiki endpoints failed');
    return NextResponse.json(
        { error: 'Failed to fetch NamuWiki data', posts: [], updatedAt: new Date().toISOString() },
        { status: 500 }
    );
}
