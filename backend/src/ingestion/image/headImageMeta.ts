export interface ImageMeta {
    contentLength?: number;
    contentType?: string;
}

/**
 * Performs a lightweight HEAD request to gather image metadata like size or type
 * @param url The image URL
 * @param timeoutMs Request timeout
 */
export async function fetchHeadImageMeta(url: string, timeoutMs: number = 5000): Promise<ImageMeta | null> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            redirect: 'follow',
            headers: {
                'User-Agent': 'PinsStudioBot/1.0 (+http://pins.studio)',
            },
        });

        clearTimeout(id);

        if (!response.ok) {
            return null;
        }

        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');

        return {
            contentLength: contentLength ? parseInt(contentLength, 10) : undefined,
            contentType: contentType || undefined,
        };
    } catch (error) {
        clearTimeout(id);
        return null; // Return null on network error, DNS issues, or aborts (don't fail ingestion)
    }
}
