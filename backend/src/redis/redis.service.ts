import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            console.warn('REDIS_URL is not set. Redis features like queueing and rate limiting will be unavailable/broken.');
            // Instantiate a dummy client that will fail gracefully or connect to localhost depending on ioredis defaults
            this.client = new Redis();
        } else {
            this.client = new Redis(redisUrl);
        }
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.disconnect();
        }
    }

    getClient(): Redis {
        return this.client;
    }
}
