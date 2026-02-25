import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { MelonSong, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://www.melon.com/chart/index.htm', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
            signal: controller.signal,
            cache: 'no-store',
        });
        clearTimeout(timer);

        if (!res.ok) {
            console.error(`[Melon] HTTP ${res.status} ${res.statusText}`);
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: 'Melon 서버에 접근할 수 없습니다.',
            } as FeedResponse<MelonSong>);
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const posts: MelonSong[] = [];

        $('tr.lst50').slice(0, 10).each((i, el) => {
            const title = $(el).find('.ellipsis.rank01 a').text().trim();
            const artist = $(el).find('.ellipsis.rank02 > a').first().text().trim();

            if (title && artist) {
                posts.push({
                    rank: posts.length + 1,
                    title,
                    artist,
                });
            }
        });

        if (posts.length === 0) {
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '차트 정보를 파싱할 수 없습니다.',
            } as FeedResponse<MelonSong>);
        }

        return NextResponse.json({
            posts,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<MelonSong>);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[Melon] Exception: ${msg}`);
        return NextResponse.json({
            posts: [],
            updatedAt: new Date().toISOString(),
            blocked: true,
            reason: '서버 연결 시간 초과 또는 오류가 발생했습니다.',
        } as FeedResponse<MelonSong>);
    }
}
