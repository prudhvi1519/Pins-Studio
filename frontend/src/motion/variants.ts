import { MotionTokens } from './tokens';

/**
 * Standard variants honoring prefers-reduced-motion.
 */

// 1) Page enter/exit transitions
export const getPageVariants = (reducedMotion: boolean) => {
    if (reducedMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.05 } },
            exit: { opacity: 0, transition: { duration: 0.05 } }
        };
    }

    return {
        initial: { opacity: 0, y: 8 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: MotionTokens.duration.standard }
        },
        exit: {
            opacity: 0,
            y: -8,
            transition: { duration: MotionTokens.duration.fast }
        }
    };
};

// 2) BottomNav Active Indicator
export const getActiveIndicatorVariants = (reducedMotion: boolean) => {
    if (reducedMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0 } },
            exit: { opacity: 0, transition: { duration: 0 } }
        };
    }

    return {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { duration: MotionTokens.duration.fast }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            transition: { duration: MotionTokens.duration.fast }
        }
    };
};

// 3) FAB Press Feedback
export const getFabPressVariants = (reducedMotion: boolean) => {
    if (reducedMotion) {
        return {}; // No scale on tap
    }
    return {
        scale: 0.98,
        transition: { duration: MotionTokens.duration.fast }
    };
};
