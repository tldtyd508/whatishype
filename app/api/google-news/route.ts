import { NextResponse } from 'next/server';
import type { GoogleNewsPost, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
                Accept: 'application/rss+xml, text/xml, */*; q=0.01',
            },
            signal: controller.signal,
            cache: 'no-store',
        });
        clearTimeout(timer);

        if (!res.ok) {
            console.error(`[GoogleNews] HTTP ${res.status} ${res.statusText}`);
            return NextResponse.json({
                posts: [],
                updatedAt: new Date().toISOString(),
                blocked: true,
                reason: 'Google News 서버에 접근할 수 없습니다.',
            } as FeedResponse<GoogleNewsPost>);
        }

        const xml = await res.text();
        const posts: GoogleNewsPost[] = [];

        // Manual regex parsing for RSS XML
        const itemRegex = /<item>[\s\S]*?<\/item>/g;
        const items = xml.match(itemRegex) || [];

        for (const item of items) {
            if (posts.length >= 10) break;

            const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const sourceMatch = item.match(/<source url=".*?">(.*?)<\/source>/);
            const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

            if (titleMatch && linkMatch) {
                // Decode HTML entities in title
                let title = titleMatch[1];
                title = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

                const url = linkMatch[1];
                const source = sourceMatch ? sourceMatch[1] : 'Google News';

                // Format time: e.g. "Thu, 26 Feb 2026 03:00:00 GMT" -> "어제", "1시간 전", etc. or just keep it simple.
                let timeStr = pubDateMatch ? pubDateMatch[1] : '';
                if (timeStr) {
                    try {
                        const pubDate = new Date(timeStr);
                        const now = new Date();
                        const diffMs = now.getTime() - pubDate.getTime();
                        const diffMins = Math.floor(diffMs / 60000);
                        if (diffMins < 60) timeStr = `${diffMins}분 전`;
                        else {
                            const diffHours = Math.floor(diffMins / 60);
                            if (diffHours < 24) timeStr = `${diffHours}시간 전`;
                            else timeStr = `${Math.floor(diffHours / 24)}일 전`;
                        }
                    } catch (e) {
                        // Keep raw string if parsing fails
                    }
                }

                posts.push({
                    rank: posts.length + 1,
                    title,
                    url,
                    source,
                    time: timeStr || '방금 전',
                });
            }
        }

        return NextResponse.json({
            posts,
            updatedAt: new Date().toISOString(),
        } as FeedResponse<GoogleNewsPost>);
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[GoogleNews] Exception: ${msg}`);
        return NextResponse.json({
            posts: [],
            updatedAt: new Date().toISOString(),
            blocked: true,
            reason: '서버 연결 시간 초과 또는 오류가 발생했습니다.',
        } as FeedResponse<GoogleNewsPost>);
    }
}
