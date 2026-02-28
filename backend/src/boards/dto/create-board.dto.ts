import { IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateBoardDto {
    @IsString()
    @MaxLength(64)
    name: string;

    @IsUUID()
    userId: string; // TEMP until Phase 6
}
