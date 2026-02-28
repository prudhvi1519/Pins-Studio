import * as React from 'react';
import { cn } from '../../lib/cn';

interface MasonryProps {
    children: React.ReactNode;
    className?: string;
}

export function Masonry({ children, className }: MasonryProps) {
    return (
        <div
            className={cn(
                // Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols
                // Gap natively handled by column-gap matching PRD (12px = gap-12)
                "columns-2 md:columns-3 lg:columns-4 gap-12 w-full",
                className
            )}
        >
            {children}
        </div>
    );
}
