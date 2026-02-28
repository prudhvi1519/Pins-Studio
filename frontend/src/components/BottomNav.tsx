import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fab from './Fab';
import { useReducedMotionPref } from '../motion/useReducedMotionPref';
import { getActiveIndicatorVariants } from '../motion/variants';

export default function BottomNav() {
    const location = useLocation();
    const prefersReducedMotion = useReducedMotionPref();
    const indicatorVariants = getActiveIndicatorVariants(prefersReducedMotion);

    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `relative flex flex-col items-center justify-center w-full h-full text-caption font-medium transition-colors ${isActive ? 'text-text' : 'text-muted hover:text-text'
            }`;
    };

    const renderActiveIndicator = (path: string) => (
        <AnimatePresence>
            {location.pathname === path && (
                <motion.div
                    layoutId="bottomNavIndicator"
                    variants={indicatorVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute -top-[1px] w-32 h-[3px] bg-accent rounded-b-chip"
                />
            )}
        </AnimatePresence>
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-64 flex items-center justify-around px-16 z-50">
            <Link to="/" className={getLinkClass('/')} aria-label="Home">
                {renderActiveIndicator('/')}
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span>Home</span>
            </Link>

            <Link to="/search" className={getLinkClass('/search')} aria-label="Search">
                {renderActiveIndicator('/search')}
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span>Search</span>
            </Link>

            {/* FAB Placeholder Slot */}
            <div className="w-64 h-full flex items-center justify-center relative">
                <Fab />
            </div>

            <Link to="/boards" className={getLinkClass('/boards')} aria-label="Boards">
                {renderActiveIndicator('/boards')}
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span>Boards</span>
            </Link>

            <Link to="/profile" className={getLinkClass('/profile')} aria-label="Profile">
                {renderActiveIndicator('/profile')}
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>Profile</span>
            </Link>
        </nav>
    );
}
