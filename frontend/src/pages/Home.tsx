import { useEffect, useState } from 'react';
import Container from '../components/layout/Container';
import { Chip } from '../components/core/Chip';
import { getPinsPage } from '../data/mockFeed';
import type { Pin } from '../types/pin';

const CATEGORIES = ['For You', 'UI', 'Marketing', 'Tools', 'Startups', 'Case Studies'];

export default function Home() {
    const [pins, setPins] = useState<Pin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialPins = async () => {
            setIsLoading(true);
            const data = await getPinsPage({ cursor: 0, limit: 20 });
            setPins(data.items);
            setIsLoading(false);
        };
        loadInitialPins();
    }, []);

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

            {/* Feed List (Non-Masonry Mock) */}
            <div className="mt-16 flex flex-col gap-24">
                {isLoading && pins.length === 0 ? (
                    <div className="text-muted text-center py-48">Loading feed...</div>
                ) : (
                    pins.map((pin) => (
                        <div key={pin.id} className="flex flex-col gap-8">
                            {/* Fixed aspect ratio container for testing without masonry */}
                            <div className="relative w-full aspect-[3/4] bg-bg rounded-card overflow-hidden border border-border">
                                <img
                                    src={pin.imageUrl}
                                    alt={pin.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="px-4">
                                <h3 className="text-body font-semibold text-text truncate">{pin.title}</h3>
                                <p className="text-caption text-muted">{pin.domain}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Container>
    );
}
