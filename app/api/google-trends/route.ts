import { NextResponse } from 'next/server';
import type { FeedResponse } from '@/app/lib/types';
import type { GoogleTrend } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://trends.google.com/trending/rss?geo=KR', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'application/rss+xml, application/xml, text/xml',
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            throw new Error(`Google Trends fetch failed: ${res.status}`);
        }

        const xml = await res.text();

        // Parse RSS XML manually (lightweight, no extra deps needed)
        const items: GoogleTrend[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
            const itemXml = match[1];

            const title = extractTag(itemXml, 'title');
            const traffic = extractTag(itemXml, 'ht:approx_traffic');

            // Get first news item
            const newsItemMatch = itemXml.match(/<ht:news_item>([\s\S]*?)<\/ht:news_item>/);
            let newsTitle: string | undefined;
            let newsUrl: string | undefined;
            let newsImage: string | undefined;
            let newsSource: string | undefined;

            if (newsItemMatch) {
                newsTitle = extractTag(newsItemMatch[1], 'ht:news_item_title');
                newsUrl = extractTag(newsItemMatch[1], 'ht:news_item_url');
                newsImage = extractTag(newsItemMatch[1], 'ht:news_item_picture');
                newsSource = extractTag(newsItemMatch[1], 'ht:news_item_source');
            }

            // Decode HTML entities
            const decoded = decodeEntities(title);

            if (decoded) {
                items.push({
                    rank: items.length + 1,
                    keyword: decoded,
                    traffic: traffic || '0',
                    newsTitle: newsTitle ? decodeEntities(newsTitle) : undefined,
                    newsUrl: newsUrl || undefined,
                    newsImage: newsImage || undefined,
                    newsSource: newsSource ? decodeEntities(newsSource) : undefined,
                });
            }
        }

        const response: FeedResponse<GoogleTrend> = {
            posts: items,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Google Trends error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Google Trends', posts: [], updatedAt: new Date().toISOString() },
            { status: 500 }
        );
    }
}

function extractTag(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

function decodeEntities(str: string): string {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}
