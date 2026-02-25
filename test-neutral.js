const https = require('https');
const cheerio = require('cheerio');

const fetchSite = (name, url, processResponse) => {
    https.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`[${name}] Status:`, res.statusCode);
            if (res.statusCode === 200) {
                processResponse(data);
            } else {
                console.log(`[${name}] Error Data length:`, data.length);
            }
        });
    }).on('error', e => console.error(`[${name}] Error:`, e));
};

// 1. Melon Chart
fetchSite('Melon', 'https://www.melon.com/chart/index.htm', (data) => {
    const $ = cheerio.load(data);
    const songs = [];
    $('tr.lst50').slice(0, 5).each((i, el) => {
        const title = $(el).find('.ellipsis.rank01 a').text().trim();
        const artist = $(el).find('.ellipsis.rank02 > a').first().text().trim();
        songs.push({ title, artist });
    });
    console.log('[Melon] Top 5:', songs);
});

// 2. Naver News (Most Viewed IT/Science)
fetchSite('NaverNews', 'https://news.naver.com/main/ranking/popularDay.naver', (data) => {
    const $ = cheerio.load(data);
    const news = [];
    $('.rankingnews_box').slice(0, 1).each((i, elBox) => {
        const press = $(elBox).find('.rankingnews_name').text().trim();
        $(elBox).find('.rankingnews_list li').slice(0, 5).each((j, elLi) => {
            const title = $(elLi).find('.list_title').text().trim();
            const time = $(elLi).find('.list_time').text().trim();
            const link = $(elLi).find('a').attr('href');
            if (title) news.push({ press, title, link, time });
        });
    });
    console.log('[NaverNews] Top 5:', news);
});
