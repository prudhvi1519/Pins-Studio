import { IsUrl, IsOptional, ValidateNested, ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PackItemDto {
    @IsUrl()
    sourceUrl: string;

    @IsOptional()
    @IsUrl()
    canonicalUrl?: string; // Optional for now
}

export class AddPackItemsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(500)
    @ValidateNested({ each: true })
    @Type(() => PackItemDto)
    items: PackItemDto[];
}
