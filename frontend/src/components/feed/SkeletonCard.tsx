import { cn } from '../../lib/cn';

interface SkeletonCardProps {
    className?: string;
    // Let the parent dictate a random height to simulate masonry
    // or default to standard aspect ratio
    height?: number | string;
}

export function SkeletonCard({ className, height = 300 }: SkeletonCardProps) {
    return (
        <div className={cn("flex flex-col gap-8 break-inside-avoid mb-12", className)}>
            <div
                className="w-full bg-border rounded-card border border-border/50"
                style={{ height }}
            />
            <div className="px-4 pb-4 space-y-4">
                <div className="h-16 w-3/4 bg-border rounded-full" />
                <div className="h-12 w-1/2 bg-bg rounded-full" />
            </div>
        </div>
    );
}
