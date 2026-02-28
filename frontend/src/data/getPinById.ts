import { SEED_PINS } from './seedPins';
import type { Pin } from '../types/pin';

export const getPinById = async (id: string): Promise<Pin | undefined> => {
    // Artificial delay to simulate network latency realistically
    await new Promise(resolve => setTimeout(resolve, 150));
    return SEED_PINS.find(pin => pin.id === id);
};
