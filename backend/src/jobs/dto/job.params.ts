import { IsString, IsNotEmpty } from 'class-validator';

export class JobParamsDto {
    @IsString()
    @IsNotEmpty()
    jobId: string;
}
