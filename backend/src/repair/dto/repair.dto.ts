import { IsString, IsOptional, IsUUID } from 'class-validator';

export class RepairSuggestionsDto {
    @IsString()
    @IsOptional()
    reason?: string;
}

export class ApplyRepairDto {
    @IsUUID()
    sourcePinId!: string;
}
