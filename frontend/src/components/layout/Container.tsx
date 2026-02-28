import type { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string; // allow overrides if absolutely needed
}

export default function Container({ children, className = '' }: ContainerProps) {
    // width strict per PRD: max-w-[1180px]
    // responsive padding per PRD: 16 mobile / 24 desktop
    return (
        <div
            className={`mx-auto w-full max-w-[1180px] px-16 md:px-24 ${className}`}
        >
            {children}
        </div>
    );
}
