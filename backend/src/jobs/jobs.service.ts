import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IngestionQueueService } from './queue/queue';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly ingestionQueue: IngestionQueueService
    ) { }

    async enqueueIngestion(packId: string, limit = 200) {
        if (process.env.INGEST_ENABLED !== 'true') {
            throw new ForbiddenException('Ingestion is currently disabled');
        }

        const pack = await this.prisma.curatedPack.findUnique({ where: { id: packId } });
        if (!pack) throw new NotFoundException('Pack not found');

        const jobId = await this.ingestionQueue.addIngestionJob({ packId, limitPerRun: limit });
        if (!jobId) {
            throw new Error('Failed to enqueue ingestion job');
        }

        return jobId;
    }

    async getJobStatus(jobId: string) {
        if (!this.ingestionQueue.queue) {
            throw new Error('Queue is unavailable');
        }

        const job = await this.ingestionQueue.queue.getJob(jobId);
        if (!job) {
            throw new NotFoundException(`Job ${jobId} not found`);
        }

        const state = await job.getState();
        const progress = job.progress;
        const result = job.returnvalue;
        const failedReason = job.failedReason;

        return {
            id: job.id,
            status: state,
            progress,
            result: result || null,
            error: failedReason || null
        };
    }
}
