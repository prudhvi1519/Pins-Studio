import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { AddPackItemsDto } from './dto/add-pack-items.dto';
import { mapPrismaError } from '../common/prisma-errors';
import { PackItemStatus } from '@prisma/client';

@Injectable()
export class PacksService {
    constructor(private prisma: PrismaService) { }

    async create(createPackDto: CreatePackDto) {
        try {
            return await this.prisma.curatedPack.create({
                data: createPackDto,
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async findAll() {
        try {
            return await this.prisma.curatedPack.findMany({
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async addItems(packId: string, addPackItemsDto: AddPackItemsDto) {
        try {
            // Validate pack exists
            const pack = await this.prisma.curatedPack.findUnique({ where: { id: packId } });
            if (!pack) throw new NotFoundException('Pack not found');

            // Fetch existing items for this pack to avoid duplicates (sourceUrl OR canonicalUrl)
            const existingItems = await this.prisma.curatedPackItem.findMany({
                where: { packId },
                select: { sourceUrl: true, canonicalUrl: true }
            });

            const existingSources = new Set(existingItems.map(i => i.sourceUrl));
            const existingCanonicals = new Set(existingItems.map(i => i.canonicalUrl));

            let created = 0;
            let skipped = 0;

            const newItems: { packId: string; sourceUrl: string; canonicalUrl: string }[] = [];

            for (const item of addPackItemsDto.items) {
                const canonical = item.canonicalUrl || item.sourceUrl; // Default canonicalUrl to sourceUrl if not provided
                if (existingSources.has(item.sourceUrl) || existingCanonicals.has(canonical)) {
                    skipped++;
                } else {
                    newItems.push({
                        packId,
                        sourceUrl: item.sourceUrl,
                        canonicalUrl: canonical,
                    });
                    existingSources.add(item.sourceUrl);
                    existingCanonicals.add(canonical);
                }
            }

            if (newItems.length > 0) {
                const result = await this.prisma.curatedPackItem.createMany({
                    data: newItems,
                    skipDuplicates: true,
                });
                created = result.count;
            }

            return { created, skipped };
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async findItems(packId: string, status?: PackItemStatus) {
        try {
            const pack = await this.prisma.curatedPack.findUnique({ where: { id: packId } });
            if (!pack) throw new NotFoundException('Pack not found');

            const whereClause: any = { packId };
            if (status) {
                whereClause.status = status;
            }

            return await this.prisma.curatedPackItem.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }
}
