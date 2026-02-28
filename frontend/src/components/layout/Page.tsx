import type { ReactNode } from 'react';

interface PageProps {
    children: ReactNode;
}

export default function Page({ children }: PageProps) {
    // pb-64 prevents content overlap with the bottom nav (64px tokens scale)
    return (
        <div className="min-h-screen bg-bg text-text pb-64">
            {children}
        </div>
    );
}
