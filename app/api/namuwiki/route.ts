import { NextResponse } from 'next/server';
import type { NamuKeyword, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://search.namu.wiki/api/ranking', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'application/json',
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            throw new Error(`NamuWiki fetch failed: ${res.status}`);
        }

        const keywords: string[] = await res.json();

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
        console.error('NamuWiki API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch NamuWiki data', posts: [], updatedAt: new Date().toISOString() },
            { status: 500 }
        );
    }
}
