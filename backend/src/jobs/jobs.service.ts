import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fetchHtmlSafely } from '../ingestion/og/og.fetch';
import { extractCanonicalFromHtml, parseOgMetadata } from '../ingestion/og/og.parse';
import { canonicalizeUrl } from '../ingestion/url/canonicalize';
import { PackItemStatus } from '@prisma/client';
import { checkImageQuality } from '../ingestion/image/imageQuality';
import { resolvePexelsFallback } from '../ingestion/pexels/pexels.search';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async ingestPack(packId: string, limit = 200) {
        // Validate pack exists
        const pack = await this.prisma.curatedPack.findUnique({ where: { id: packId } });
        if (!pack) throw new NotFoundException('Pack not found');

        // Get pending items
        const items = await this.prisma.curatedPackItem.findMany({
            where: {
                packId,
                status: PackItemStatus.pending,
            },
            take: limit,
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

        // Since this is Prompt 2, we process sequentially to avoid overwhelming rate limits
        for (const item of items) {
            summary.processed++;

            try {
                // 1. Fetch HTML safely
                const fetchResult = await fetchHtmlSafely(item.sourceUrl);

                if (fetchResult.error || !fetchResult.html) {
                    throw new Error(fetchResult.error || 'Empty HTML returned');
                }

                // 2. Extract Canonical link element from HTML if present
                const canonicalFromHtml = extractCanonicalFromHtml(fetchResult.html);

                // 3. Robust Canonicalization
                // Use the final resolved URL from fetchResult if there are redirects, as base
                const finalUrl = canonicalizeUrl(fetchResult.url || item.sourceUrl, canonicalFromHtml);

                if (!finalUrl) {
                    throw new Error('canonicalize_failed_invalid_url');
                }

                // 4. Parse OG Metadata
                const ogMetadata = parseOgMetadata(fetchResult.html, finalUrl);

                // Update the item strictly to lock in the computed canonicalUrl
                await this.prisma.curatedPackItem.update({
                    where: { id: item.id },
                    data: { canonicalUrl: finalUrl },
                });

                // 5. Attempt creation in DB (dedupe handling via Prisma Catch)
                let finalImage = ogMetadata.image || '';
                let attributionText: string | null = null;
                let lastErrorVal: string | null = null;

                // Image Quality Gate & Pexels Fallback
                const qualityCheck = await checkImageQuality(finalImage);
                if (!qualityCheck.isAcceptable) {
                    this.logger.log(`Image candidate rejected (${qualityCheck.reason}) for ${finalUrl}, triggering fallback...`);
                    const fallback = await resolvePexelsFallback(ogMetadata.title, ogMetadata.domain);
                    if (fallback) {
                        finalImage = fallback.imageUrl;
                        attributionText = fallback.attributionText;
                    } else {
                        // If Pexels fails, keep whatever we had (or empty), but append warning to lastError
                        lastErrorVal = 'pexels_failed';
                    }
                }

                try {
                    // Temporarily hardcode a system userId if needed, or query first admin.
                    // The PRD says "no auth yet, create placeholder userId handling".
                    // We'll just grab the first user in DB to act as the ingest owner
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

                    // Mark item ingested
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
                        // Unique constraint violation -> treated as deduped successfully
                        await this.prisma.curatedPackItem.update({
                            where: { id: item.id },
                            data: {
                                status: PackItemStatus.ingested,
                                lastError: 'duplicate_canonical',
                            },
                        });
                        summary.deduped++;
                        summary.ingested++; // Count duplicate as successfully resolved
                    } else {
                        throw dbError; // Bubble unexpected DB errors
                    }
                }

            } catch (itemError: any) {
                summary.failed++;
                const errorMessage = itemError.message || 'unknown_error';
                summary.errors.push({ itemId: item.id, error: errorMessage });

                // Mark failed
                await this.prisma.curatedPackItem.update({
                    where: { id: item.id },
                    data: {
                        status: PackItemStatus.failed,
                        lastError: String(errorMessage).slice(0, 255),
                    },
                });
            }
        }

        return summary;
    }
}
