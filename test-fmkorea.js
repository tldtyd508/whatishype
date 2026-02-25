const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.fmkorea.com/best', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const $ = cheerio.load(data);
      const posts = [];
      $('.fm_best_widget ul li').each((i, el) => {
        const titleEl = $(el).find('.title a').first();
        let title = titleEl.text().trim();
        // Remove comment count from title if needed
        const commentCount = $(el).find('.replyNum').text().trim();
        if (commentCount && title.endsWith(commentCount)) {
          title = title.slice(0, -(commentCount.length)).trim();
        }

        const link = titleEl.attr('href');
        const category = $(el).find('.category a').text().trim();
        const author = $(el).find('.author').text().trim();
        const url = link ? (link.startsWith('http') ? link : 'https://www.fmkorea.com' + link) : '';

        if (title && url) {
          posts.push({ rank: posts.length + 1, title, url, category, author });
        }
      });
      console.log('Parsed Posts:', posts.slice(0, 5));
    } else {
      console.log('Failed:', res.statusCode);
    }
  });
}).on('error', e => console.error(e));
