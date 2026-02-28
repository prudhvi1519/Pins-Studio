import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastStore, type ToastConfig } from './toastStore';
import { useReducedMotionPref } from '../../motion/useReducedMotionPref';
import { getToastVariants } from '../../motion/variants';

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);
    const prefersReduced = useReducedMotionPref();
    const toastVariants = getToastVariants(prefersReduced);

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = toastStore.subscribe((newToasts) => {
            setToasts([...newToasts]);
        });
        return unsubscribe;
    }, []);

    return (
        <div
            className="fixed bottom-[88px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-12 z-[100] pointer-events-none"
        // bottom-[88px] securely clears the 64px BottomNav + 24px gap per PRD
        >
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        variants={toastVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout="position"
                        className={`
              pointer-events-auto px-16 py-12 rounded-input shadow-sheet max-w-[90vw] md:max-w-md w-full
              flex items-center text-button
              ${t.type === 'error' ? 'bg-red-50 text-red-900 border border-red-200' :
                                t.type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' :
                                    'bg-text text-surface'}
            `}
                    >
                        <span>{t.message}</span>
                        <button
                            onClick={() => toastStore.remove(t.id)}
                            className="ml-auto opacity-70 hover:opacity-100 p-4 -pr-4"
                            aria-label="Dismiss"
                        >
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
