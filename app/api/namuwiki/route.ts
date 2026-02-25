import { NextResponse } from 'next/server';
import type { NamuKeyword, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = 'https://search.namu.wiki/api/ranking';

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'ko-KR,ko;q=0.9',
                Referer: 'https://namu.wiki/',
                Origin: 'https://namu.wiki',
            },
            signal: controller.signal,
            cache: 'no-store',
        });
        clearTimeout(timer);

        if (!res.ok) {
            // Cloudflare 403 = expected in serverless
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '나무위키 Cloudflare 보호로 서버에서 접근 불가합니다.',
            });
        }

        const text = await res.text();
        const keywords: string[] = JSON.parse(text);

        if (!Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '나무위키에서 빈 데이터를 반환했습니다.',
            });
        }

        const posts: NamuKeyword[] = keywords.map((keyword, index) => ({
            rank: index + 1,
            keyword,
        }));

        return NextResponse.json({
            posts,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<NamuKeyword>);
    } catch {
        return NextResponse.json({
            posts: [],
            updatedAt: new Date().toISOString(),
            blocked: true,
            reason: '나무위키 서버에 연결할 수 없습니다.',
        });
    }
}
