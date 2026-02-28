import { useState, useEffect } from 'react';
import Sheet from '../primitives/Sheet';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { useBoards } from '../../hooks/useBoards';
import { useToast } from '../primitives/useToast';
import { cn } from '../../lib/cn';

interface SaveToBoardSheetProps {
    isOpen: boolean;
    onClose: () => void;
    pinId: string;
}

export function SaveToBoardSheet({ isOpen, onClose, pinId }: SaveToBoardSheetProps) {
    const { boards, createBoard, savePin, getSuggestedBoard } = useBoards();
    const { toast } = useToast();

    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [newBoardName, setNewBoardName] = useState('');

    const suggestedBoard = getSuggestedBoard();

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setNewBoardName('');
            const suggested = getSuggestedBoard();
            setSelectedBoardId(suggested ? suggested.id : null);
        }
    }, [isOpen, getSuggestedBoard]);

    const handleSave = () => {
        if (!selectedBoardId) return;
        const board = boards.find(b => b.id === selectedBoardId);
        if (board) {
            savePin(pinId, board.id);
            toast({ message: `Saved to ${board.name}`, type: 'success' });
            onClose();
        }
    };

    const handleCreateAndSave = () => {
        const { board, isNew } = createBoard(newBoardName);
        if (board) {
            if (isNew) {
                toast({ message: 'Board created', type: 'success' }); // Required PRD copy
            }
            savePin(pinId, board.id);
            // Delay the second toast slightly to avoid React batching visual jank, or stack them
            setTimeout(() => {
                toast({ message: `Saved to ${board.name}`, type: 'success' });
            }, 100);

            onClose();
        }
    };

    const trimmedInput = newBoardName.trim();
    const isCreateValid = trimmedInput.length >= 1 && trimmedInput.length <= 32;

    return (
        <Sheet isOpen={isOpen} onClose={onClose} title="Save to board">
            <div className="flex flex-col gap-24">
                {/* Suggested Board */}
                {suggestedBoard && (
                    <div className="flex flex-col gap-8">
                        <span className="text-caption font-semibold text-muted">Suggested</span>
                        <button
                            onClick={() => setSelectedBoardId(suggestedBoard.id)}
                            className={cn(
                                "flex items-center justify-between p-12 rounded-card text-left transition-colors",
                                selectedBoardId === suggestedBoard.id
                                    ? "bg-accent/10 border border-accent/20"
                                    : "bg-surface border border-border hover:bg-bg"
                            )}
                        >
                            <span className="text-body font-semibold text-text truncate">
                                Suggested: {suggestedBoard.name}
                            </span>
                            {selectedBoardId === suggestedBoard.id && (
                                <svg className="w-20 h-20 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}

                {/* All Boards List */}
                <div className="flex flex-col gap-8">
                    <span className="text-caption font-semibold text-muted">All Boards</span>
                    <div className="flex flex-col gap-8 max-h-[30vh] overflow-y-auto no-scrollbar pr-4">
                        {boards.map(board => {
                            // Don't duplicate if it's already suggested
                            return (
                                <button
                                    key={board.id}
                                    onClick={() => setSelectedBoardId(board.id)}
                                    className={cn(
                                        "flex items-center justify-between p-12 rounded-card text-left transition-colors",
                                        selectedBoardId === board.id
                                            ? "bg-accent/10 border border-accent/20"
                                            : "bg-surface border border-border hover:bg-bg"
                                    )}
                                >
                                    <span className="text-body font-semibold text-text truncate">
                                        {board.name}
                                    </span>
                                    {selectedBoardId === board.id && (
                                        <svg className="w-20 h-20 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!selectedBoardId}
                        className="mt-8"
                    >
                        Save
                    </Button>
                </div>

                <div className="w-full h-[1px] bg-border my-8" />

                {/* Inline Create Row */}
                <div className="flex flex-col gap-12">
                    <span className="text-caption font-semibold text-muted">Create board</span>
                    <div className="flex items-center gap-12">
                        <div className="flex-grow">
                            <Input
                                placeholder="Create new board…"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                maxLength={32}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            disabled={!isCreateValid}
                            onClick={handleCreateAndSave}
                            className="flex-shrink-0"
                        >
                            Create & Save
                        </Button>
                    </div>
                </div>
            </div>
        </Sheet>
    );
}
