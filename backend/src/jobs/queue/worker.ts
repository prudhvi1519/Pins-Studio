import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { RedisService } from '../../redis/redis.service';
import { INGESTION_QUEUE_NAME, IngestionJobPayload } from './queue';
// Extract business logic that was formerly in jobs.service.ts
import { PrismaService } from '../../prisma/prisma.service';
import { fetchHtmlSafely } from '../../ingestion/og/og.fetch';
import { extractCanonicalFromHtml, parseOgMetadata } from '../../ingestion/og/og.parse';
import { canonicalizeUrl } from '../../ingestion/url/canonicalize';
import { PackItemStatus } from '@prisma/client';
import { checkImageQuality } from '../../ingestion/image/imageQuality';
import { resolvePexelsFallback } from '../../ingestion/pexels/pexels.search';

@Injectable()
export class IngestionWorkerService implements OnModuleInit, OnModuleDestroy {
    private worker: Worker<IngestionJobPayload, any>;
    private readonly logger = new Logger(IngestionWorkerService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService,
    ) { }

    onModuleInit() {
        if (process.env.REDIS_URL && process.env.WORKER_MODE === 'true') {
            this.logger.log('Starting BullMQ Worker for background ingestion...');
            this.worker = new Worker<IngestionJobPayload>(
                INGESTION_QUEUE_NAME,
                async (job: Job<IngestionJobPayload>) => {
                    return this.processJob(job);
                },
                { connection: this.redisService.getClient() as any, concurrency: 1 }
            );

            this.worker.on('completed', (job) => {
                this.logger.log(`Job ${job.id} completed successfully`);
            });

            this.worker.on('failed', (job, err) => {
                this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
            });
        }
    }

    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
        }
    }

    private async processJob(job: Job<IngestionJobPayload>) {
        const { packId, limitPerRun } = job.data;

        // Exact same synchronous logic from Phase 5 Prompt 3:
        const pack = await this.prisma.curatedPack.findUnique({ where: { id: packId } });
        if (!pack) throw new Error('Pack not found');

        const items = await this.prisma.curatedPackItem.findMany({
            where: {
                packId,
                status: PackItemStatus.pending,
            },
            take: limitPerRun || 200,
            orderBy: { createdAt: 'asc' },
        });

        const summary = {
            packId,
            processed: 0,
            ingested: 0,
            failed: 0,
            deduped: 0,
            errors: [] as { itemId: string; error: string }[],
        };

        if (items.length === 0) {
            return summary;
        }

        for (const item of items) {
            summary.processed++;

            try {
                const fetchResult = await fetchHtmlSafely(item.sourceUrl);

                if (fetchResult.error || !fetchResult.html) {
                    throw new Error(fetchResult.error || 'Empty HTML returned');
                }

                const canonicalFromHtml = extractCanonicalFromHtml(fetchResult.html);
                const finalUrl = canonicalizeUrl(fetchResult.url || item.sourceUrl, canonicalFromHtml);

                if (!finalUrl) {
                    throw new Error('canonicalize_failed_invalid_url');
                }

                const ogMetadata = parseOgMetadata(fetchResult.html, finalUrl);

                await this.prisma.curatedPackItem.update({
                    where: { id: item.id },
                    data: { canonicalUrl: finalUrl },
                });

                let finalImage = ogMetadata.image || '';
                let attributionText: string | null = null;
                let lastErrorVal: string | null = null;

                const qualityCheck = await checkImageQuality(finalImage);
                if (!qualityCheck.isAcceptable) {
                    this.logger.log(`Image rejected (${qualityCheck.reason}) for ${finalUrl}, triggering fallback...`);
                    const fallback = await resolvePexelsFallback(ogMetadata.title, ogMetadata.domain);
                    if (fallback) {
                        finalImage = fallback.imageUrl;
                        attributionText = fallback.attributionText;
                    } else {
                        lastErrorVal = 'pexels_failed';
                    }
                }

                try {
                    const adminUser = await this.prisma.user.findFirst();
                    if (!adminUser) throw new Error('system_user_missing');

                    await this.prisma.pin.create({
                        data: {
                            title: ogMetadata.title || 'Untitled',
                            description: ogMetadata.description,
                            sourceUrl: item.sourceUrl,
                            canonicalUrl: finalUrl,
                            domain: ogMetadata.domain,
                            imageUrl: finalImage,
                            attributionText: attributionText,
                            userId: adminUser.id,
                        },
                    });

                    await this.prisma.curatedPackItem.update({
                        where: { id: item.id },
                        data: {
                            status: PackItemStatus.ingested,
                            lastError: lastErrorVal,
                        },
                    });

                    summary.ingested++;

                } catch (dbError: any) {
                    if (dbError.code === 'P2002') {
                        await this.prisma.curatedPackItem.update({
                            where: { id: item.id },
                            data: {
                                status: PackItemStatus.ingested,
                                lastError: 'duplicate_canonical',
                            },
                        });
                        summary.deduped++;
                        summary.ingested++;
                    } else {
                        throw dbError;
                    }
                }

            } catch (itemError: any) {
                summary.failed++;
                const errorMessage = itemError.message || 'unknown_error';
                summary.errors.push({ itemId: item.id, error: errorMessage });

                await this.prisma.curatedPackItem.update({
                    where: { id: item.id },
                    data: {
                        status: PackItemStatus.failed,
                        lastError: String(errorMessage).slice(0, 255),
                    },
                });
            }
        }

        // Update job progress explicitly to 100
        await job.updateProgress(100);

        return summary;
    }
}
