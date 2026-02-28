import type { Pin } from '../../types/pin';
import { cn } from '../../lib/cn';

interface PinCardProps {
    pin: Pin;
    className?: string;
    onClick?: () => void;
}

export function PinCard({ pin, className, onClick }: PinCardProps) {
    // We use the image height if available to prevent layout shifting
    // Fallback to a 3/4 aspect ratio if unknown
    const aspectRatio = pin.imageWidth && pin.imageHeight
        ? `${pin.imageWidth} / ${pin.imageHeight}`
        : '3 / 4';

    return (
        <div
            className={cn(
                "flex flex-col gap-8 group cursor-zoom-in break-inside-avoid mb-12",
                className
            )}
            onClick={onClick}
        >
            <div
                className="relative w-full bg-bg rounded-card overflow-hidden shadow-card"
                style={{ aspectRatio }}
            >
                <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:brightness-95 transition-all"
                    loading="lazy"
                />

                {/* Hover overlay placeholder for future Save button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>

            <div className="px-4 pb-4">
                <h3 className="text-body font-semibold text-text truncate">{pin.title}</h3>
                <p className="text-caption text-muted truncate">{pin.domain}</p>
            </div>
        </div>
    );
}
