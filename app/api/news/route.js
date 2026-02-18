import { NextResponse } from 'next/server';

export async function GET() {
    const FEEDS = [
        "https://news.google.com/rss/search?q=energie+OR+strompreis+OR+gaspreis&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=dieselpreis+OR+kraftstoffpreis+OR+LKW+Maut&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=ladeinfrastruktur+OR+E-LKW+OR+Elektrotruck+OR+Wasserstoff+LKW&hl=de&gl=DE&ceid=DE:de",
        "https://news.google.com/rss/search?q=CO2+Abgabe+OR+Klimagesetz+OR+Emissionshandel+OR+EU+Transport&hl=de&gl=DE&ceid=DE:de"
    ];

    try {
        const fetchFeeds = FEEDS.map(url => fetch(url).then(r => r.text()));
        const results = await Promise.all(fetchFeeds);

        // Return all XMLs joined or better, combine them into one structure?
        // Let's just return a combined string or better yet, a JSON array of items to make client side easier
        // But since I'm using DOMParser on client, maybe I should just return multiple XML contents or a single JSON.
        // Let's go with JSON to avoid complex XML merging.

        return NextResponse.json({ feeds: results }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error fetching news feeds:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
