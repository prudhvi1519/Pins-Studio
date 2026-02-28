import { useState, useCallback, useRef, useEffect } from 'react';
import type { Pin } from '../types/pin';
import { getPinsPage } from '../data/mockFeed';

interface UseInfinitePinsReturn {
    pins: Pin[];
    isLoadingInitial: boolean;
    isFetchingMore: boolean;
    hasNextPage: boolean;
    loadMore: () => Promise<void>;
}

export function useInfinitePins(): UseInfinitePinsReturn {
    const [pins, setPins] = useState<Pin[]>([]);
    const [cursor, setCursor] = useState<number | null>(0);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Guard against strict mode double-firing
    const isFetchingRef = useRef(false);

    // Restore scroll state hook
    useEffect(() => {
        const savedScrollPos = sessionStorage.getItem('feedScrollY');
        if (savedScrollPos) {
            // Small timeout to allow basic layout shift processing before scroll restoration
            const id = setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPos, 10));
            }, 50);
            return () => clearTimeout(id);
        }
    }, []);

    // Save scroll state hook
    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem('feedScrollY', window.scrollY.toString());
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initial load effect
    useEffect(() => {
        const loadInitial = async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            setIsLoadingInitial(true);

            const data = await getPinsPage({ cursor: 0, limit: 20 });
            setPins(data.items);
            setCursor(data.nextCursor);

            setIsLoadingInitial(false);
            isFetchingRef.current = false;
        };

        if (pins.length === 0) {
            loadInitial();
        }
    }, [pins.length]);

    const loadMore = useCallback(async () => {
        if (cursor === null || isFetchingRef.current) return;

        isFetchingRef.current = true;
        setIsFetchingMore(true);

        try {
            const data = await getPinsPage({ cursor, limit: 20 });

            setPins(prev => {
                // Deduplicate pins just in case
                const existingIds = new Set(prev.map(p => p.id));
                const newPins = data.items.filter(p => !existingIds.has(p.id));
                return [...prev, ...newPins];
            });

            setCursor(data.nextCursor);
        } finally {
            setIsFetchingMore(false);
            isFetchingRef.current = false;
        }
    }, [cursor]);

    return {
        pins,
        isLoadingInitial,
        isFetchingMore,
        hasNextPage: cursor !== null,
        loadMore
    };
}
