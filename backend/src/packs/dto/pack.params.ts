import { IsUUID } from 'class-validator';

export class PackParamsDto {
    @IsUUID(4, { message: 'Invalid pack UUID format' })
    id: string;
}
