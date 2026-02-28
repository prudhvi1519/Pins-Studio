import { fetchHeadImageMeta } from './headImageMeta';

export interface ImageQualityCheck {
    isAcceptable: boolean;
    reason?: string;
}

const MIN_KB_FILESIZE = 30; // ~30KB threshold
const MIN_WIDTH = 600;

export async function checkImageQuality(imageUrl: string, widthFromMeta?: number): Promise<ImageQualityCheck> {
    // If no URL given, immediately unacceptable
    if (!imageUrl) {
        return { isAcceptable: false, reason: 'missing_url' };
    }

    // 1) SVG heuristic: many SVGs are small logos, but if the URL explicitly ends with .svg we reject
    if (imageUrl.toLowerCase().endsWith('.svg') || imageUrl.includes('image/svg+xml')) {
        return { isAcceptable: false, reason: 'svg_unsupported' };
    }

    // 2) If we explicitly know the width from OG tags and it's too small
    if (widthFromMeta !== undefined && widthFromMeta < MIN_WIDTH) {
        return { isAcceptable: false, reason: `meta_width_too_small_${widthFromMeta}` };
    }

    // 3) Perform HEAD request to check headers
    const meta = await fetchHeadImageMeta(imageUrl);

    // If HEAD request failed (e.g. 403, timeout). We accept it blindly rather than failing the whole Pin.
    if (!meta) {
        return { isAcceptable: true, reason: 'head_request_failed_but_accepted' };
    }

    // 4) Check Content-Type boundary
    if (meta.contentType && !meta.contentType.startsWith('image/')) {
        return { isAcceptable: false, reason: `invalid_content_type_${meta.contentType}` };
    }

    // 5) Check File Size heuristic
    if (meta.contentLength !== undefined) {
        const kb = (meta.contentLength / 1024);
        if (kb < MIN_KB_FILESIZE) {
            return { isAcceptable: false, reason: `file_size_too_small_${Math.round(kb)}kb` };
        }
    }

    return { isAcceptable: true };
}
