import { IsString, MaxLength, MinLength, Matches, IsOptional } from 'class-validator';

export class CreatePackDto {
    @IsString()
    @MinLength(1)
    @MaxLength(80)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(40)
    @Matches(/^[a-z0-9-]+$/, {
        message: 'Slug must consist of lowercase letters, numbers, and hyphens only',
    })
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;
}
