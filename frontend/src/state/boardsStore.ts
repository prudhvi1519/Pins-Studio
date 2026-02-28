import type { Board } from '../types/board';
import { MOCK_BOARDS } from '../data/mockBoards';

class BoardsStore {
    private boards: Board[] = [...MOCK_BOARDS];
    // Map of pinId -> boardId
    private savedPins: Record<string, string> = {};
    private listeners: Set<() => void> = new Set();

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    getBoards() {
        return this.boards;
    }

    getSavedBoardId(pinId: string) {
        return this.savedPins[pinId] || null;
    }

    createBoard(name: string): { board: Board | null; isNew: boolean } {
        const trimmed = name.trim();
        if (trimmed.length < 1 || trimmed.length > 32) return { board: null, isNew: false };

        const existing = this.boards.find(b => b.name.toLowerCase() === trimmed.toLowerCase());
        if (existing) return { board: existing, isNew: false }; // Dedupe

        const newBoard: Board = {
            id: `board-${Date.now()}`,
            name: trimmed,
            createdAt: Date.now()
        };
        // Add to front so it shows up at the top
        this.boards = [newBoard, ...this.boards];
        this.notify();
        return { board: newBoard, isNew: true };
    }

    savePinToBoard(pinId: string, boardId: string) {
        this.savedPins[pinId] = boardId;
        this.notify();
    }
}

export const boardsStore = new BoardsStore();
