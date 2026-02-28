import { HttpException, HttpStatus, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function mapPrismaError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': {
                // Unique constraint failed
                const fields = error.meta?.target as string[];
                const target = fields ? fields.join(', ') : 'field';
                throw new ConflictException(`${target} already exists`);
            }
            case 'P2003': {
                // Foreign key constraint failed
                const fieldName = error.meta?.field_name as string;
                // The error message from user prompt specifically mentions "invalid userId/boardId"
                if (fieldName && fieldName.includes('userId')) {
                    throw new BadRequestException('invalid userId');
                }
                if (fieldName && fieldName.includes('boardId')) {
                    throw new BadRequestException('invalid boardId');
                }
                throw new BadRequestException('invalid reference');
            }
            case 'P2025': {
                // An operation failed because it depends on one or more records that were required but not found.
                throw new NotFoundException('Record not found');
            }
        }
    }

    // If it's already an HttpException (like a NotFoundException we explicitly threw), just rethrow
    if (error instanceof HttpException) {
        throw error;
    }

    // Fallback for unexpected errors
    throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR);
}
