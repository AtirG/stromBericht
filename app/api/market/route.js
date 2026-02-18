import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.smard.de/app/chart_data/410/DE';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const timestamp = searchParams.get('timestamp');

    try {
        if (type === 'index') {
            const response = await fetch(`${BASE_URL}/index_hour.json`);
            if (!response.ok) throw new Error('Failed to fetch SMARD index');
            const data = await response.json();
            return NextResponse.json(data);
        }

        if (type === 'data' && timestamp) {
            const response = await fetch(`${BASE_URL}/410_DE_hour_${timestamp}.json`);
            if (!response.ok) throw new Error('Failed to fetch SMARD data');
            const data = await response.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    } catch (error) {
        console.error('SMARD API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
