import { motion } from 'framer-motion';
import { useReducedMotionPref } from '../motion/useReducedMotionPref';
import { getFabPressVariants } from '../motion/variants';

export default function Fab() {
    const prefersReduced = useReducedMotionPref();
    const pressVariants = getFabPressVariants(prefersReduced);

    return (
        <motion.button
            whileTap={pressVariants}
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-text hover:bg-hover text-surface rounded-chip p-16 shadow-sheet flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
            aria-label="Create Placeholder"
        >
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </motion.button>
    );
}
