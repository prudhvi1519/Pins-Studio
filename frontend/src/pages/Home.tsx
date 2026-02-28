import { useEffect, useRef } from 'react';
import Container from '../components/layout/Container';
import { Chip } from '../components/core/Chip';
import { PinCard } from '../components/feed/PinCard';
import { Masonry } from '../components/feed/Masonry';
import { SkeletonCard } from '../components/feed/SkeletonCard';
import { useInfinitePins } from '../hooks/useInfinitePins';

const CATEGORIES = ['For You', 'UI', 'Marketing', 'Tools', 'Startups', 'Case Studies'];

export default function Home() {
    const { pins, isLoadingInitial, isFetchingMore, hasNextPage, loadMore } = useInfinitePins();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (isLoadingInitial) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingMore) {
                    loadMore();
                }
            },
            { rootMargin: '800px' }
        );

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [isLoadingInitial, isFetchingMore, hasNextPage, loadMore]);

    return (
        <Container className="pt-24 pb-32">
            {/* Filter Chips Row */}
            <div className="flex gap-8 overflow-x-auto pb-16 no-scrollbar">
                {CATEGORIES.map((cat, idx) => (
                    <Chip key={cat} selected={idx === 0} size="md">
                        {cat}
                    </Chip>
                ))}
            </div>

            <div className="mt-16">
                <Masonry>
                    {/* Render actual pins */}
                    {pins.map((pin) => (
                        <PinCard key={pin.id} pin={pin} />
                    ))}

                    {/* Skeletons block during initial load or pagination */}
                    {(isLoadingInitial || isFetchingMore) && (
                        <>
                            {Array.from({ length: isLoadingInitial ? 12 : 4 }).map((_, i) => (
                                <SkeletonCard
                                    key={`skeleton-${i}`}
                                    height={300 + (i % 3) * 50}
                                />
                            ))}
                        </>
                    )}
                </Masonry>

                {/* Sentinel for IntersectionObserver */}
                <div ref={sentinelRef} className="h-1" />

                {/* End of feed graceful state */}
                {!hasNextPage && !isLoadingInitial && (
                    <div className="text-center py-24 text-muted text-caption">
                        You've reached the end of the line!
                    </div>
                )}
            </div>
        </Container>
    );
}
