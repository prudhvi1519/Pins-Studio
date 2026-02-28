import { IsEnum, IsOptional } from 'class-validator';
import { PackItemStatus } from '@prisma/client';

export class PackQueryDto {
    @IsOptional()
    @IsEnum(PackItemStatus, { message: 'status must be pending, ingested, or failed' })
    status?: PackItemStatus;
}
