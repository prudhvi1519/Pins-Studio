import { PexelsSearchResponse } from './pexels.types';

export async function fetchPexelsSearch(query: string): Promise<PexelsSearchResponse | null> {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
        console.warn('PEXELS_API_KEY is not defined in environment');
        return null;
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.pexels.com/v1/search?query=${encodedQuery}&per_page=1&orientation=portrait`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Authorization': apiKey,
                'User-Agent': 'PinsStudioBot/1.0 (+http://pins.studio)',
            },
        });

        clearTimeout(id);

        if (!response.ok) {
            console.error(`Pexels API failed with status ${response.status}`);
            return null;
        }

        const data: PexelsSearchResponse = await response.json();
        return data;
    } catch (error) {
        clearTimeout(id);
        console.error('Pexels API request failed:', error);
        return null;
    }
}
