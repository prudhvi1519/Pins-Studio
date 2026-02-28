import { fetchPexelsSearch } from './pexels.client';
import { PexelsPhoto } from './pexels.types';

export interface PexelsFallbackResult {
    imageUrl: string;
    attributionText: string;
}

export async function resolvePexelsFallback(title: string | null, domain: string): Promise<PexelsFallbackResult | null> {
    // Construct a fallback query: use title, or gracefully back down to the clean domain if title too short
    let searchQuery = domain;
    if (title && title.length > 5) {
        searchQuery = title.substring(0, 40); // cap query length
    }

    const response = await fetchPexelsSearch(searchQuery);

    if (!response || !response.photos || response.photos.length === 0) {
        return null; // fallback completely failed or returned 0 results
    }

    const photo: PexelsPhoto = response.photos[0];

    // Prefer large2x > large > original
    const bestUrl = photo.src.large2x || photo.src.large || photo.src.original;

    const attributionText = `Photo by ${photo.photographer} on Pexels`;

    return {
        imageUrl: bestUrl,
        attributionText,
    };
}
