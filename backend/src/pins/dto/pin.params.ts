import { IsUUID } from 'class-validator';

export class PinParamsDto {
    @IsUUID(4, { message: 'Invalid UUID format' })
    id: string;
}
