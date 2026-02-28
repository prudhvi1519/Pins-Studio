import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotionPref } from '../../motion/useReducedMotionPref';
import { getSheetVariants, getBackdropVariants } from '../../motion/variants';

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Sheet({ isOpen, onClose, title, children }: SheetProps) {
    const prefersReduced = useReducedMotionPref();
    const sheetVariants = getSheetVariants(prefersReduced);
    const backdropVariants = getBackdropVariants(prefersReduced);

    const previousFocusRef = useRef<HTMLElement | null>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // 1) Save previous focus
            previousFocusRef.current = document.activeElement as HTMLElement;

            // 2) Lock body scroll
            document.body.style.overflow = 'hidden';

            // 3) Focus the sheet itself for ESC/a11y mechanics
            // We need a small timeout to let the sheet mount in the DOM before focusing
            const timeoutId = setTimeout(() => {
                sheetRef.current?.focus();
            }, 0);

            return () => {
                clearTimeout(timeoutId);
                document.body.style.overflow = '';
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen]);

    // ESC key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // If we're not running in a browser environment with document body ready
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end">
                    {/* Backdrop (Blur + Dim) - tap to close */}
                    <motion.div
                        variants={backdropVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Sheet Body */}
                    <motion.div
                        ref={sheetRef}
                        // Add tabIndex -1 so it can programmatically take focus
                        tabIndex={-1}
                        variants={sheetVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative w-full max-w-[1180px] mx-auto bg-surface rounded-t-sheet shadow-sheet outline-none focus:outline-none flex flex-col max-h-[90vh]"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'sheet-title' : undefined}
                    >
                        {/* Grabber indicator (visual only) */}
                        <div className="flex justify-center pt-12 pb-8">
                            <div className="w-48 h-[4px] bg-border rounded-chip" />
                        </div>

                        {/* Header (Optional via children/title, but generic close here if needed) */}
                        {title && (
                            <div className="px-16 md:px-24 pb-16 flex items-center justify-between border-b border-border">
                                <h2 id="sheet-title" className="text-h2 font-h2 text-text m-0">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-8 -mr-8 text-muted hover:text-text rounded-chip transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
                                    aria-label="Close sheet"
                                >
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Scrollable Content Area */}
                        <div className="px-16 md:px-24 py-24 overflow-y-auto overscroll-contain pb-64">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
