import type { Pin } from '../types/pin';

// We use picsum.photos with a seed to get stable, deterministic placeholder images.
// Width remains standard, height fluctuates to simulate masonry eventually (for Phase 3 prompt 2).
const generateSeedData = (): Pin[] => {
    const categories = ['UI', 'Marketing', 'Tools', 'Startups', 'Case Studies'];
    const domains = ['dribbble.com', 'behance.net', 'github.com', 'producthunt.com', 'medium.com'];

    const pins: Pin[] = [];

    for (let i = 1; i <= 65; i++) {
        const seed = `pin${i}`;
        const category = categories[i % categories.length];
        const domain = domains[i % domains.length];

        // Vary heights predictably for future masonry validation
        const height = 300 + ((i * 37) % 400);
        const width = 400;

        pins.push({
            id: `mock-pin-${i}`,
            title: `Placeholder Inspiration ${i} - ${category}`,
            domain,
            sourceUrl: `https://${domain}/design/${i}`,
            canonicalUrl: `https://${domain}/design/${i}`,
            imageUrl: `https://picsum.photos/seed/${seed}/${width}/${height}`,
            imageWidth: width,
            imageHeight: height,
            category,
            tags: ['design', category.toLowerCase(), 'inspiration']
        });
    }

    return pins;
};

export const SEED_PINS: Pin[] = generateSeedData();
