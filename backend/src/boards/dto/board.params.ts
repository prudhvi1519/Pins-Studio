import { IsUUID, IsOptional } from 'class-validator';

export class BoardParamsDto {
    @IsUUID(4, { message: 'Invalid board UUID format' })
    id: string;
}

export class BoardPinParamsDto {
    @IsUUID(4, { message: 'Invalid board UUID format' })
    id: string;

    @IsUUID(4, { message: 'Invalid pin UUID format' })
    pinId: string;
}

export class BoardsQueryDto {
    @IsOptional()
    @IsUUID(4, { message: 'Invalid userId UUID format' })
    userId?: string;
}
