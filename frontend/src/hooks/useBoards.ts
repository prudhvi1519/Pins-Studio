import { useSyncExternalStore, useCallback } from 'react';
import { boardsStore } from '../state/boardsStore';
import type { Board } from '../types/board';

export function useBoards() {
    const boards = useSyncExternalStore(
        boardsStore.subscribe.bind(boardsStore),
        () => boardsStore.getBoards()
    );

    const createBoard = useCallback((name: string) => {
        return boardsStore.createBoard(name);
    }, []);

    const savePin = useCallback((pinId: string, boardId: string) => {
        boardsStore.savePinToBoard(pinId, boardId);
    }, []);

    const getSavedBoardId = useCallback((pinId: string) => {
        return boardsStore.getSavedBoardId(pinId);
    }, []);

    const getSuggestedBoard = useCallback((): Board | null => {
        if (boards.length === 0) return null;

        const uiInspo = boards.find(b => b.name === 'UI Inspiration');
        if (uiInspo) return uiInspo;

        // Fallback to most recently created
        return [...boards].sort((a, b) => b.createdAt - a.createdAt)[0];
    }, [boards]);

    return {
        boards,
        createBoard,
        savePin,
        getSavedBoardId,
        getSuggestedBoard
    };
}
