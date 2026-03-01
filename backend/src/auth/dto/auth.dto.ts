import { IsEmail, IsOptional, IsString } from 'class-validator';

export class DevLoginDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
