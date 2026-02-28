import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';
import { getFabPressVariants } from '../../motion/variants';
import { useReducedMotionPref } from '../../motion/useReducedMotionPref';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', children, disabled, ...props }, ref) => {
        const prefersReducedMotion = useReducedMotionPref();
        const pressVariants = getFabPressVariants(prefersReducedMotion);

        // Tokens based on pure Phase 2 design system
        const baseStyles = "inline-flex items-center justify-center min-h-[44px] px-24 rounded-full font-button text-button transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-accent text-surface hover:bg-hover active:bg-hover shadow-sm",
            secondary: "bg-surface border border-border text-text hover:bg-bg active:bg-border",
            ghost: "bg-transparent text-accent hover:bg-accent/10 active:bg-accent/20"
        };

        return (
            <motion.button
                ref={ref}
                whileTap={disabled ? undefined : pressVariants}
                className={cn(baseStyles, variants[variant], className)}
                disabled={disabled}
                {...(props as HTMLMotionProps<"button">)}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
