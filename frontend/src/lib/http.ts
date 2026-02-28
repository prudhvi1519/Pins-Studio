import { API_URL } from '../config/env';

/**
 * Minimal HTTP helper for Phase 1.
 * Currently unused by UI.
 */
export async function getJson<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
}
