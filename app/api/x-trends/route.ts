import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { XTrend, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://trends24.in/korea/', {
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
            console.error(`[X-Trends] HTTP ${res.status} ${res.statusText}`);
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '트렌드 서버에 접근할 수 없습니다.',
            } as FeedResponse<XTrend>);
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const trends: XTrend[] = [];

        // trends24.in displays multiple lists for different timeframes.
        // We take the first one (most recent).
        $('.trend-card__list')
            .first()
            .find('li')
            .each((i, el) => {
                if (trends.length >= 10) return; // Top 10 only

                const keyword =
                    $(el).find('.trend-name').text().trim() ||
                    $(el).find('a').text().trim();
                const count = $(el).find('.tweet-count').text().trim();

                if (keyword) {
                    trends.push({
                        rank: trends.length + 1,
                        keyword,
                        tweetCount: count || undefined,
                    });
                }
            });

        if (trends.length === 0) {
            console.error('[X-Trends] Found no trends in HTML');
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: '트렌드 데이터를 파싱할 수 없습니다.',
            } as FeedResponse<XTrend>);
        }

        return NextResponse.json({
            posts: trends,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<XTrend>);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[X-Trends] Exception: ${msg}`);
        return NextResponse.json({
            posts: [],
            updatedAt: new Date().toISOString(),
            blocked: true,
            reason: '서버 연결 시간 초과 또는 오류가 발생했습니다.',
        } as FeedResponse<XTrend>);
    }
}
