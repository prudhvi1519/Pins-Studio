import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedQueryDto } from './dto/feed.query';

@Injectable()
export class PinsService {
    constructor(private prisma: PrismaService) { }

    async getFeed(query: FeedQueryDto) {
        const limit = query.limit || 20;
        const clampedLimit = Math.max(1, Math.min(limit, 50));
        let cursorObj: { createdAt: string; id: string } | null = null;

        if (query.cursor) {
            try {
                const decoded = Buffer.from(query.cursor, 'base64').toString('utf-8');
                cursorObj = JSON.parse(decoded);
                if (!cursorObj?.createdAt || !cursorObj?.id) {
                    throw new Error('Invalid cursor format');
                }
            } catch (err) {
                throw new BadRequestException('Invalid cursor');
            }
        }

        // Build the query where clause
        let whereClause = {};
        if (cursorObj) {
            whereClause = {
                OR: [
                    { createdAt: { lt: new Date(cursorObj.createdAt) } },
                    {
                        createdAt: new Date(cursorObj.createdAt),
                        id: { lt: cursorObj.id },
                    },
                ],
            };
        }

        // We fetch limit + 1 to know if there's a next page
        const pins = await this.prisma.pin.findMany({
            where: whereClause,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' },
            ],
            take: clampedLimit + 1,
        });

        const hasNextPage = pins.length > clampedLimit;
        const items = hasNextPage ? pins.slice(0, -1) : pins;

        let nextCursor: string | null = null;
        if (items.length > 0) { // If there are no items, nextCursor is null
            if (hasNextPage) {
                const lastItem = items[items.length - 1];
                const nextCursorObj = {
                    createdAt: lastItem.createdAt.toISOString(),
                    id: lastItem.id,
                };
                nextCursor = Buffer.from(JSON.stringify(nextCursorObj)).toString('base64');
            }
        }

        return {
            items,
            nextCursor,
        };
    }
}
