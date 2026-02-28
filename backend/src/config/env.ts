export const ENV = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    CORS_ORIGINS: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
        : ['http://localhost:5173', 'http://localhost:4173'],
};
