import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { mapPrismaError } from '../common/prisma-errors';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) { }

    async create(createBoardDto: CreateBoardDto) {
        try {
            return await this.prisma.board.create({
                data: createBoardDto,
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async findAll(userId?: string) {
        try {
            const whereClause = userId ? { userId } : {};
            return await this.prisma.board.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async findOne(id: string) {
        try {
            const board = await this.prisma.board.findUnique({
                where: { id },
            });
            if (!board) {
                throw new NotFoundException('Record not found');
            }
            return board;
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async update(id: string, updateBoardDto: UpdateBoardDto) {
        try {
            return await this.prisma.board.update({
                where: { id },
                data: updateBoardDto,
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.board.delete({
                where: { id },
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async assignPin(boardId: string, pinId: string) {
        try {
            // Validate board exists
            const board = await this.prisma.board.findUnique({ where: { id: boardId } });
            if (!board) throw new NotFoundException('Board not found');

            // Validate pin exists and update its boardId mapping
            return await this.prisma.pin.update({
                where: { id: pinId },
                data: { boardId },
            });
        } catch (error) {
            mapPrismaError(error);
        }
    }

    async unassignPin(boardId: string, pinId: string) {
        try {
            // Validate board and pin relation directly using findFirst or findUnique
            const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
            if (!pin) throw new NotFoundException('Pin not found');
            if (!boardId) throw new NotFoundException('Board not found'); // Should have already validated param id formats

            if (pin.boardId !== boardId) {
                throw new ConflictException('pin not assigned to board');
            }

            await this.prisma.pin.update({
                where: { id: pinId },
                data: { boardId: null },
            });
            return;
        } catch (error) {
            mapPrismaError(error);
        }
    }
}
