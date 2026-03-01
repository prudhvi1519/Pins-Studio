export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export const JWT_CONFIG = {
    ACCESS_EXPIRES_IN: '15m',
    REFRESH_EXPIRES_IN: '7d',
};
