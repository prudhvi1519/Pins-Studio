export default function Fab() {
    return (
        <button
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-text hover:bg-hover text-surface rounded-chip p-16 shadow-sheet flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            aria-label="Create Placeholder"
        >
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    );
}
