import { stripTracking } from './stripTracking';

/**
 * Canonicalizes a URL based on robust rules.
 * @param sourceUrl The original URL string
 * @param canonicalFromHtml The literal href from <link rel="canonical"> tag if present
 * @returns Decided canonical string, or null if parse totally fails
 */
export function canonicalizeUrl(sourceUrl: string, canonicalFromHtml?: string | null): string | null {
    try {
        let base = new URL(sourceUrl);

        // If scheme is missing (e.g., //example.com), force https
        if (base.protocol !== 'http:' && base.protocol !== 'https:') {
            base = new URL('https://' + sourceUrl);
        }

        let target = base;

        // Evaluate canonicalTag if present
        if (canonicalFromHtml) {
            try {
                const canonical = new URL(canonicalFromHtml, base.href); // Resolves relative links against base

                // Simple heuristic: if the domains match exactly, or canonical is www equivalent
                // we trust it. Strip 'www.' to compare core domains
                const baseDomain = base.hostname.replace(/^www\./, '');
                const canDomain = canonical.hostname.replace(/^www\./, '');

                if (baseDomain === canDomain) {
                    target = canonical;
                }
            } catch (e) {
                // invalid canonical URL, stick to base
            }
        }

        // Normalize
        target.hostname = target.hostname.toLowerCase();

        // Remove default ports
        if (target.port === '80' && target.protocol === 'http:') target.port = '';
        if (target.port === '443' && target.protocol === 'https:') target.port = '';

        // Strip tracking parameters
        stripTracking(target);

        // Sort search parameters for deterministic URL string
        target.searchParams.sort();

        // Construct final string
        let finalStr = target.href;

        // Remove trailing slash if it has no path other than root
        // To match PRD "remove trailing slash (except root)", actually we want path '/' to stay '/' if empty,
        // but if it's `/foo/`, it becomes `/foo` unless it's just `https://example.com/`.
        // Wait, the prompt says "remove trailing slash (except root)".
        // A URL object will format `https://example.com` as `https://example.com/` which is the root.
        // If we have `https://example.com/foo/`, we strip it.
        if (target.pathname !== '/' && target.pathname.endsWith('/')) {
            target.pathname = target.pathname.slice(0, -1);
            finalStr = target.href;
        }

        return finalStr;
    } catch (error) {
        return null; // parse totally failed
    }
}
