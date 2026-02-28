/**
 * List of common tracking parameters to strip from URLs
 * to ensure cleaner canonical URLs.
 */
const trackingParams = new Set([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'msclkid',
    'igshid',
    'mc_cid',
    'mc_eid',
    '_hsenc',
    '_hsmi',
    'zanpid',
]);

/**
 * Removes known tracking parameters from a URL object in-place.
 * @param url URL object to modify
 */
export function stripTracking(url: URL): void {
    const keysToDelete: string[] = [];
    url.searchParams.forEach((value, key) => {
        if (trackingParams.has(key.toLowerCase())) {
            keysToDelete.push(key);
        }
    });

    keysToDelete.forEach(key => url.searchParams.delete(key));
}
