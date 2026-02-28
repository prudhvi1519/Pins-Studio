import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';
import { getFabPressVariants } from '../../motion/variants';
import { useReducedMotionPref } from '../../motion/useReducedMotionPref';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
    size?: 'sm' | 'md'; // sm=32px, md=40px from spacing scale
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
    ({ className, selected = false, size = 'sm', disabled, children, ...props }, ref) => {
        const prefersReducedMotion = useReducedMotionPref();
        const pressVariants = getFabPressVariants(prefersReducedMotion);

        const baseStyles = "inline-flex items-center justify-center rounded-full font-button text-caption transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed border whitespace-nowrap";

        const sizeStyles = {
            sm: "h-32 px-16",
            md: "h-40 px-20"
        };

        const stateStyles = selected
            ? "bg-text text-surface border-text hover:opacity-90"
            : "bg-surface text-text border-border hover:bg-bg";

        return (
            <motion.button
                ref={ref}
                whileTap={disabled ? undefined : pressVariants}
                className={cn(baseStyles, sizeStyles[size], stateStyles, className)}
                aria-pressed={selected}
                disabled={disabled}
                {...(props as HTMLMotionProps<"button">)}
            >
                {children}
            </motion.button>
        );
    }
);

Chip.displayName = 'Chip';
