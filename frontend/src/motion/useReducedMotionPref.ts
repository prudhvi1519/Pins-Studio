import { useState, useEffect } from 'react';

/**
 * Returns a boolean indicating whether the user has requested
 * the system minimize the amount of non-essential motion.
 */
export function useReducedMotionPref() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        // React cleanly to system preference changes during usage
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener);
        } else {
            mediaQuery.addListener(listener);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', listener);
            } else {
                mediaQuery.removeListener(listener);
            }
        };
    }, []);

    return prefersReducedMotion;
}
