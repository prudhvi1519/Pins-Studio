import { IsOptional, IsString, IsInt, Min, MaxLength, IsUrl, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePinDto {
    @IsString()
    @MaxLength(120)
    title: string;

    @IsUrl()
    sourceUrl: string;

    @IsUrl()
    canonicalUrl: string;

    @IsString()
    @MaxLength(120)
    domain: string;

    @IsUrl()
    imageUrl: string;

    @IsUUID()
    userId: string; // TEMP until Phase 6

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[] = [];

    @IsOptional()
    @IsString()
    @MaxLength(64)
    category?: string;

    @IsOptional()
    @IsUUID()
    boardId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    imageWidth?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    imageHeight?: number;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    attributionText?: string;
}
