const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
    const res1 = await fetchUrl('https://trends24.in/korea/');
    console.log('trends24.in/korea/', res1.status, res1.data.slice(0, 200));
  } catch (e) { console.log('trends24 error', e.message); }

  try {
    const res2 = await fetchUrl('https://getdaytrends.com/korea/');
    console.log('getdaytrends.com/korea/', res2.status, res2.data.slice(0, 200));
  } catch (e) { console.log('getdaytrends error', e.message); }
}

main();
