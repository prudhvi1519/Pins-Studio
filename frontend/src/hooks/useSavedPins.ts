import { useCallback, useSyncExternalStore } from 'react';
import { boardsStore } from '../state/boardsStore';
import { SEED_PINS } from '../data/seedPins';
import type { Pin } from '../types/pin';
import type { Board } from '../types/board';

// A tiny global store just to force re-renders when a save happens, 
// so components using useSavedPins update immediately.
// We could just subscribe to boardsStore, but boardsStore already notifies on save!
// We can use boardsStore's subscription mechanism.

export function useSavedPins() {
    // We subscribe to boardsStore to trigger re-renders when saved states change
    useSyncExternalStore(
        boardsStore.subscribe.bind(boardsStore),
        () => boardsStore.getBoards() // We just need something that changes or we can rely on React calling this
    );

    const isSaved = useCallback((pinId: string) => {
        return boardsStore.getSavedBoardId(pinId) !== null;
    }, []);

    const getSavedBoard = useCallback((pinId: string): Board | null => {
        const boardId = boardsStore.getSavedBoardId(pinId);
        if (!boardId) return null;

        const boards = boardsStore.getBoards();
        return boards.find(b => b.id === boardId) || null;
    }, []);

    const listSavedPins = useCallback((boardId: string): Pin[] => {
        // Find all pins where boardsStore.getSavedBoardId(pinId) === boardId
        // In a real app we'd query the DB. Here we just filter the SEED_PINS.
        return SEED_PINS.filter(pin => boardsStore.getSavedBoardId(pin.id) === boardId);
    }, []);

    const getBoardPinCount = useCallback((boardId: string): number => {
        return listSavedPins(boardId).length;
    }, [listSavedPins]);

    return {
        isSaved,
        getSavedBoard,
        listSavedPins,
        getBoardPinCount
    };
}
