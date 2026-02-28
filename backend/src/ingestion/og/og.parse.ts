import * as cheerio from 'cheerio';
import { OgMetadata } from './og.types';

export function parseOgMetadata(html: string, urlStr: string): OgMetadata {
    const $ = cheerio.load(html);

    // Helper to get meta tag content
    const getMeta = (property: string, name: string) => {
        return (
            $(`meta[property="${property}"]`).attr('content') ||
            $(`meta[name="${name}"]`).attr('content') ||
            null
        );
    };

    // Determine actual hostname from the resolved URL
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(urlStr);
    } catch (e) {
        parsedUrl = new URL('https://unknown.com');
    }

    // 1. Extract Title: og:title > <title> > hostname
    let title = getMeta('og:title', 'title');
    if (!title) {
        title = $('title').first().text();
    }
    if (!title || title.trim() === '') {
        title = parsedUrl.hostname.replace(/^www\./, '');
    }

    // 2. Extract Description: og:description > meta name="description"
    const description = getMeta('og:description', 'description');

    // 3. Extract Image: og:image (first)
    let image = getMeta('og:image', 'image');

    // Make image URL absolute if it is relative
    if (image && !image.startsWith('http') && !image.startsWith('https')) {
        try {
            const imgUrl = new URL(image, parsedUrl.href);
            image = imgUrl.href;
        } catch (e) {
            image = null; // Unresolvable
        }
    }

    // 4. Domain (from canonicalUrl/inputUrl hostname, no www)
    const domain = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

    return {
        title: title.trim(),
        description: description ? description.trim() : null,
        image: image ? image.trim() : null,
        domain,
    };
}

export function extractCanonicalFromHtml(html: string): string | null {
    const $ = cheerio.load(html);
    const canonicalHref = $('link[rel="canonical"]').attr('href');
    return canonicalHref || null;
}
