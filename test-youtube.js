const https = require('https');

https.get('https://www.youtube.com/feed/trending?bp=4gINGgt5dG1hX2NoYXJ0cw%3D%3D', { // Music trending, or just /feed/trending
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'ko-KR,ko;q=0.9',
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('YouTube Status:', res.statusCode);
        const match = data.match(/var ytInitialData = (\{.*?\});<\/script>/);
        if (match) {
            try {
                const json = JSON.parse(match[1]);
                // check contents
                console.log('Found ytInitialData, keys:', Object.keys(json));
                // Just write it out to yt.json to check
                require('fs').writeFileSync('yt.json', JSON.stringify(json, null, 2));
                console.log('Saved to yt.json');
            } catch (e) { console.log('Parsing error', e); }
        } else {
            console.log('ytInitialData not found, length:', data.length);
        }
    });
}).on('error', e => console.error(e));
