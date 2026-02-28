import type { Pin } from '../types/pin';
import { SEED_PINS } from './seedPins';

export interface FeedPage {
    items: Pin[];
    nextCursor: number | null;
}

export const getPinsPage = async ({ cursor = 0, limit = 20 }: { cursor?: number; limit?: number }): Promise<FeedPage> => {
    // Artificial delay to simulate network latency but not too slow (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));

    const start = cursor;
    const end = start + limit;
    const items = SEED_PINS.slice(start, end);

    const nextCursor = end < SEED_PINS.length ? end : null;

    return {
        items,
        nextCursor
    };
};
