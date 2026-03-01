import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepairService {
    constructor(private prisma: PrismaService) { }

    async getSuggestions(pinId: string) {
        const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
        if (!pin) throw new NotFoundException('Pin not found for repair');

        // 1. Tags matching
        if (pin.tags && pin.tags.length > 0) {
            const relatedByTags = await this.prisma.pin.findMany({
                where: {
                    id: { not: pin.id },
                    tags: { hasSome: pin.tags },
                },
                take: 3,
            });
            if (relatedByTags.length > 0) {
                return relatedByTags.map(p => ({
                    id: p.id,
                    title: p.title,
                    sourceUrl: p.sourceUrl,
                    canonicalUrl: p.canonicalUrl,
                    domain: p.domain,
                    reason: 'related_by_tag'
                }));
            }
        }

        // 2. Category matching
        if (pin.category) {
            const relatedByCat = await this.prisma.pin.findMany({
                where: {
                    id: { not: pin.id },
                    category: pin.category,
                },
                take: 3,
            });
            if (relatedByCat.length > 0) {
                return relatedByCat.map(p => ({
                    id: p.id,
                    title: p.title,
                    sourceUrl: p.sourceUrl,
                    canonicalUrl: p.canonicalUrl,
                    domain: p.domain,
                    reason: 'related_by_category'
                }));
            }
        }

        // 3. Domain matching
        if (pin.domain) {
            const relatedByDomain = await this.prisma.pin.findMany({
                where: {
                    id: { not: pin.id },
                    domain: pin.domain,
                },
                take: 3,
            });
            if (relatedByDomain.length > 0) {
                return relatedByDomain.map(p => ({
                    id: p.id,
                    title: p.title,
                    sourceUrl: p.sourceUrl,
                    canonicalUrl: p.canonicalUrl,
                    domain: p.domain,
                    reason: 'related_by_domain'
                }));
            }
        }

        // 4. Default Recent Fallback
        const recent = await this.prisma.pin.findMany({
            where: { id: { not: pin.id } },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        return recent.map(p => ({
            id: p.id,
            title: p.title,
            sourceUrl: p.sourceUrl,
            canonicalUrl: p.canonicalUrl,
            domain: p.domain,
            reason: 'recent'
        }));
    }

    async applyRepair(pinId: string, sourcePinId: string) {
        const originalPin = await this.prisma.pin.findUnique({ where: { id: pinId } });
        if (!originalPin) throw new NotFoundException('Original Pin not found');

        const sourcePin = await this.prisma.pin.findUnique({ where: { id: sourcePinId } });
        if (!sourcePin) throw new NotFoundException('Source Pin for repair not found');

        try {
            const updatedPin = await this.prisma.pin.update({
                where: { id: originalPin.id },
                data: {
                    sourceUrl: sourcePin.sourceUrl,
                    canonicalUrl: sourcePin.canonicalUrl,
                    domain: sourcePin.domain,
                    title: sourcePin.title,
                    description: sourcePin.description,
                    tags: sourcePin.tags,
                    category: sourcePin.category,
                    imageUrl: sourcePin.imageUrl,
                    attributionText: sourcePin.attributionText,
                }
            });

            return {
                pin: updatedPin,
                message: "Repaired and updated"
            };
        } catch (error: any) {
            // P2002 is Prisma's unique constraint violation code
            if (error && error.code === 'P2002') {
                throw new ConflictException('canonicalUrl already exists');
            }
            throw error;
        }
    }
}
