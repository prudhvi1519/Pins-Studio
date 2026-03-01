import { Controller, Post, Param, ValidationPipe, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { JobsService } from './jobs.service';
import { PackParamsDto } from '../packs/dto/pack.params';
import { JobParamsDto } from './dto/job.params';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post('ingest-pack/:id')
    @UseGuards(JwtCookieGuard, AdminRoleGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 ingestion requests per min
    async ingestPack(@Param(new ValidationPipe({ whitelist: true })) params: PackParamsDto) {
        // Enqueue job via JobService
        const jobId = await this.jobsService.enqueueIngestion(params.id);
        return { jobId };
    }

    @Get(':jobId')
    async getJobStatus(@Param(new ValidationPipe({ whitelist: true })) params: JobParamsDto) {
        return this.jobsService.getJobStatus(params.jobId);
    }
}
