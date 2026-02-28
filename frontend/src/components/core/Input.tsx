import * as React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full min-h-[44px] px-16 rounded-input bg-surface text-text border border-border placeholder:text-muted focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-body",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
