const https = require('https');
const cheerio = require('cheerio');

https.get('https://trends24.in/korea/', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const trends = [];
    $('.trend-card__list').first().find('li').each((i, el) => {
      const keyword = $(el).find('.trend-name').text().trim() || $(el).find('a').text().trim();
      const count = $(el).find('.tweet-count').text().trim();
      if (keyword) trends.push({ keyword, count });
    });
    console.log(trends.slice(0, 10));
  });
}).on('error', (e) => console.log('error', e.message));
