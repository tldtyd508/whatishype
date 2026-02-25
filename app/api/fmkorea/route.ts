import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { FmKoreaPost, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://www.fmkorea.com/best', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
            },
            signal: controller.signal,
            cache: 'no-store',
        });
        clearTimeout(timer);

        if (!res.ok) {
            console.error(`[FMKorea] HTTP ${res.status} ${res.statusText}`);
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: 'FMKorea 서버에 접근할 수 없습니다.',
            } as FeedResponse<FmKoreaPost>);
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const posts: FmKoreaPost[] = [];

        $('.fm_best_widget ul li').each((i, el) => {
            if (posts.length >= 10) return; // limit to top 10 for balancing UI

            const titleEl = $(el).find('.title a').first();
            let title = titleEl.text().trim();
            const commentCount = $(el).find('.replyNum').text().trim();
            if (commentCount && title.endsWith(commentCount)) {
                title = title.slice(0, -(commentCount.length)).trim();
            }

            const link = titleEl.attr('href');
            const category = $(el).find('.category a').text().trim();
            const author = $(el).find('.author').text().trim();
            let url = link || '';
            if (url && !url.startsWith('http')) {
                url = url.startsWith('/') ? `https://www.fmkorea.com${url}` : `https://www.fmkorea.com/${url}`;
            }

            if (title && url) {
                posts.push({
                    rank: posts.length + 1,
                    title,
                    url,
                    category,
                    author,
                });
            }
        });

        if (posts.length === 0) {
            console.error('[FMKorea] No posts found. HTML might have changed or bot protection is active.');
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '포텐 게시물을 파싱할 수 없습니다.',
            } as FeedResponse<FmKoreaPost>);
        }

        return NextResponse.json({
            posts,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<FmKoreaPost>);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[FMKorea] Exception: ${msg}`);
        return NextResponse.json({
            posts: [],
            updatedAt: new Date().toISOString(),
            blocked: true,
            reason: '서버 연결 시간 초과 또는 오류가 발생했습니다.',
        } as FeedResponse<FmKoreaPost>);
    }
}
