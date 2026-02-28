import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../../redis/redis.service';

export const INGESTION_QUEUE_NAME = 'ingestion';

export interface IngestionJobPayload {
    packId: string;
    limitPerRun: number;
}

@Injectable()
export class IngestionQueueService implements OnModuleInit, OnModuleDestroy {
    public queue: Queue<IngestionJobPayload>;
    private readonly logger = new Logger(IngestionQueueService.name);

    constructor(private readonly redisService: RedisService) { }

    onModuleInit() {
        // If Redis is disabled/missing, BullMQ will continuously try to connect and throw errors
        // so we only bind the queue if the redis client is active and REDIS_URL was supplied
        if (process.env.REDIS_URL) {
            this.queue = new Queue(INGESTION_QUEUE_NAME, {
                connection: this.redisService.getClient() as any,
            });
            this.logger.log(`BullMQ Queue '${INGESTION_QUEUE_NAME}' initialized`);
        } else {
            this.logger.warn('Redis URL missing. Async Ingestion Queue is disabled.');
        }
    }

    async onModuleDestroy() {
        if (this.queue) {
            await this.queue.close();
        }
    }

    async addIngestionJob(payload: IngestionJobPayload): Promise<string | null> {
        if (!this.queue) {
            throw new Error('Queue not initialized. Ensure REDIS_URL is configured.');
        }
        const job = await this.queue.add('ingest-pack', payload);
        return job.id ? String(job.id) : null;
    }
}
