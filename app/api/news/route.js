import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MAX_REQUESTS = 1000;
const COUNTER_FILE = path.join(process.cwd(), '.request_counter.json');

function getCount() {
    try {
        if (fs.existsSync(COUNTER_FILE)) {
            const data = fs.readFileSync(COUNTER_FILE, 'utf8');
            return JSON.parse(data).count || 0;
        }
    } catch (e) {
        console.error('Error reading counter file:', e);
    }
    return global._requestCount || 0;
}

function incrementCount() {
    const newCount = getCount() + 1;
    global._requestCount = newCount;
    try {
        fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: newCount }));
    } catch (e) {
        console.error('Error writing counter file:', e);
    }
    return newCount;
}

export async function GET() {
    const currentCount = getCount();

    if (currentCount >= MAX_REQUESTS) {
        return NextResponse.json({
            error: 'API request limit reached (1000/1000).',
            detail: 'Total allowwd requests for this feed have been exhausted.'
        }, { status: 429 });
    }

    const FEEDS = [
        "https://news.google.com/rss/search?q=energie+OR+strompreis+OR+gaspreis&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=dieselpreis+OR+kraftstoffpreis+OR+LKW+Maut&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=ladeinfrastruktur+OR+E-LKW+OR+Elektrotruck+OR+Wasserstoff+LKW&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=CO2+Abgabe+OR+Klimagesetz+OR+Emissionshandel+OR+EU+Transport&hl=de&gl=DE&ceid=DE:de"
    ];

    try {
        incrementCount();
        const fetchFeeds = FEEDS.map(url => fetch(url).then(r => r.text()));
        const results = await Promise.all(fetchFeeds);

        return NextResponse.json({
            feeds: results,
            requestCount: currentCount + 1,
            limit: MAX_REQUESTS
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error fetching news feeds:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
