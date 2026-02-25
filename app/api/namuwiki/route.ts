import { NextResponse } from 'next/server';
import type { NamuKeyword, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

async function tryFetchJson(url: string, headers: Record<string, string>, timeoutMs: number): Promise<string[] | null> {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
            headers,
            signal: controller.signal,
            cache: 'no-store',
        });

        clearTimeout(timer);

        if (!res.ok) {
            console.error(`[NamuWiki] ${url} → HTTP ${res.status} ${res.statusText}`);
            const body = await res.text().catch(() => '(no body)');
            console.error(`[NamuWiki] Response body: ${body.slice(0, 300)}`);
            return null;
        }

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (Array.isArray(data) && data.length > 0) {
                console.log(`[NamuWiki] ✓ ${url} → ${data.length} keywords`);
                return data as string[];
            }
            console.error(`[NamuWiki] ${url} → not array or empty`);
            return null;
        } catch {
            console.error(`[NamuWiki] ${url} → invalid JSON: ${text.slice(0, 200)}`);
            return null;
        }
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[NamuWiki] ${url} → exception: ${msg}`);
        return null;
    }
}

export async function GET() {
    const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        Referer: 'https://namu.wiki/',
        Origin: 'https://namu.wiki',
    };

    // Try all endpoints in parallel
    const results = await Promise.all([
        tryFetchJson('https://search.namu.wiki/api/ranking', browserHeaders, 5000),
        tryFetchJson('https://search.namu.wiki/api/ranking', {
            ...browserHeaders,
            'User-Agent': 'web:whatishype:v1.0',
        }, 5000),
    ]);

    const keywords = results.find((r) => r !== null);

    if (keywords) {
        const posts: NamuKeyword[] = keywords.map((keyword, index) => ({
            rank: index + 1,
            keyword,
        }));

        const response: FeedResponse<NamuKeyword> = {
            posts,
            updatedAt: new Date().toISOString(),
        };
        return NextResponse.json(response);
    }

    console.error('[NamuWiki] All endpoints failed');
    return NextResponse.json(
        { error: '나무위키 서버에서 차단됨 (Vercel IP)', posts: [], updatedAt: new Date().toISOString() },
        { status: 502 }
    );
}
