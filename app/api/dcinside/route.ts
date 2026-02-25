import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { DcPost, FeedResponse } from '@/app/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://gall.dcinside.com/board/lists/?id=dcbest&page=1', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            throw new Error(`DC fetch failed: ${res.status}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const posts: DcPost[] = [];

        // Parse the board list table rows
        $('tr.ub-content').each((index, el) => {
            if (posts.length >= 30) return;

            const $el = $(el);

            // Get title - the main link text
            const $titleLink = $el.find('td.gall_tit a:first');
            const rawTitle = $titleLink.text().trim();
            if (!rawTitle) return;

            // Extract gallery tag like [싱갤] from the title
            const tagMatch = rawTitle.match(/^\[([^\]]+)\]/);
            const galleryTag = tagMatch ? tagMatch[1] : '';
            const title = tagMatch ? rawTitle.replace(tagMatch[0], '').trim() : rawTitle;

            // Get comment count from the reply count element
            const replyText = $el.find('td.gall_tit a.reply_numbox').text().trim();
            const commentMatch = replyText.match(/\[(\d+)/);
            const commentCount = commentMatch ? parseInt(commentMatch[1], 10) : 0;

            // Get link
            const href = $titleLink.attr('href') || '';
            const link = href.startsWith('http')
                ? href
                : `https://gall.dcinside.com${href}`;

            posts.push({
                rank: posts.length + 1,
                title,
                galleryTag,
                commentCount,
                link,
            });
        });

        const response: FeedResponse<DcPost> = {
            posts,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('DCInside scraping error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch DCInside data', posts: [], updatedAt: new Date().toISOString() },
            { status: 500 }
        );
    }
}
