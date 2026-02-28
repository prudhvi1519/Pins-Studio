import type { Board } from '../types/board';

export const MOCK_BOARDS: Board[] = [
    { id: 'board-mock-1', name: 'UI Inspiration', createdAt: Date.now() - 1000000 },
    { id: 'board-mock-2', name: 'Typography', createdAt: Date.now() - 800000 },
    { id: 'board-mock-3', name: 'Brand Identity', createdAt: Date.now() - 600000 },
    { id: 'board-mock-4', name: 'Motion Design', createdAt: Date.now() - 400000 },
    { id: 'board-mock-5', name: 'Productivity Tools', createdAt: Date.now() - 200000 },
];
