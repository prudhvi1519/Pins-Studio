import { Response } from 'express';

export const COOKIE_NAMES = {
    ACCESS: 'ps_access',
    REFRESH: 'ps_refresh',
};

export function setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
) {
    const isDev = process.env.NODE_ENV !== 'production'; // Using false for secure in local as requested "secure: false"
    const cookieDomain = process.env.COOKIE_DOMAIN;

    const baseOptions = {
        httpOnly: true,
        secure: false, // Ensure false for local as requested
        sameSite: 'lax' as const,
        path: '/',
        ...(cookieDomain && cookieDomain.trim() !== '' ? { domain: cookieDomain } : {}),
    };

    res.cookie(COOKIE_NAMES.ACCESS, accessToken, {
        ...baseOptions,
        maxAge: 15 * 60 * 1000, // 15m
    });

    res.cookie(COOKIE_NAMES.REFRESH, refreshToken, {
        ...baseOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
}

export function clearAuthCookies(res: Response) {
    const cookieDomain = process.env.COOKIE_DOMAIN;
    const baseOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        path: '/',
        ...(cookieDomain && cookieDomain.trim() !== '' ? { domain: cookieDomain } : {}),
    };

    res.clearCookie(COOKIE_NAMES.ACCESS, baseOptions);
    res.clearCookie(COOKIE_NAMES.REFRESH, baseOptions);
}
