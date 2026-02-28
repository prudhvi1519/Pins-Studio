import * as https from 'https';
import * as http from 'http';

export interface FetchResult {
    html: string;
    url: string; // The final resolved URL after redirects
    error?: string;
    status?: number;
}

export async function fetchHtmlSafely(url: string, timeoutMs = 8000, maxSizeBytes = 2 * 1024 * 1024): Promise<FetchResult> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'PinsStudioBot/1.0 (+http://pins.studio)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            redirect: 'follow', // Fetch API follows up to 20 redirects natively by default, which is safe enough
        });

        clearTimeout(id);

        if (!response.ok) {
            return { html: '', url: response.url, error: `HTTP ${response.status}`, status: response.status };
        }

        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
            return { html: '', url: response.url, error: `Invalid content type: ${contentType}` };
        }

        // Read stream safely bounded by max size
        const reader = response.body?.getReader();
        if (!reader) {
            return { html: '', url: response.url, error: 'No response body' };
        }

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            if (value) {
                receivedLength += value.length;
                chunks.push(value);

                if (receivedLength > maxSizeBytes) {
                    reader.cancel();
                    return { html: '', url: response.url, error: 'Response exceeded maximum allowed size' };
                }
            }
        }

        // Combine chunks
        const htmlBuffer = Buffer.concat(chunks);
        const htmlString = htmlBuffer.toString('utf-8');

        return { html: htmlString, url: response.url, status: response.status };

    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            return { html: '', url, error: 'Request timed out' };
        }
        return { html: '', url, error: error.message || 'Unknown network error' };
    }
}
