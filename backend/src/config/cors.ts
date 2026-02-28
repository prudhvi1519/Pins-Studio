import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ENV } from './env';

export const corsConfig: CorsOptions = {
    origin: ENV.CORS_ORIGINS,
    credentials: false, // Wait until Phase 6 for cookies/auth
};
