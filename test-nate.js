const https = require('https');
const cheerio = require('cheerio');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function main() {
    try {
        const res = await fetchUrl('https://www.nate.com/');
        if (res.status === 200) {
            const $ = cheerio.load(res.data);
            const nateTrends = [];
            $('.isKeywordList li').each((i, el) => {
                const keyword = $(el).find('.kwd a').text().trim();
                if (keyword) nateTrends.push(keyword);
            });
            console.log('Nate:', nateTrends.slice(0, 10));
        } else {
            console.log('Nate blocked:', res.status);
        }
    } catch (e) { console.log('Nate error', e.message); }

    try {
        const res = await fetchUrl('https://zum.com/');
        if (res.status === 200) {
            const $ = cheerio.load(res.data);
            const zumTrends = [];
            $('.issue-keyword-item').each((i, el) => {
                const keyword = $(el).text().trim();
                if (keyword) zumTrends.push(keyword);
            });
            console.log('Zum:', zumTrends.slice(0, 10));
        } else {
            console.log('Zum blocked:', res.status);
        }
    } catch (e) { console.log('Zum error', e.message); }
}

main();
