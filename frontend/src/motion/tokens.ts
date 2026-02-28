/**
 * Phase 2 centralized motion tokens.
 * Values reflect the exact PRD requirements.
 */
export const MotionTokens = {
    duration: {
        fast: 0.16,      // 160ms
        standard: 0.22,  // 220ms
        emphasis: 0.28,  // 280ms
    },
    spring: {
        sheet: {
            type: 'spring',
            stiffness: 380,
            damping: 32,
        }
    }
};
