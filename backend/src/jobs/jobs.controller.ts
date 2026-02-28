import { Controller, Post, Param, ValidationPipe, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { JobsService } from './jobs.service';
import { PackParamsDto } from '../packs/dto/pack.params';
import { JobParamsDto } from './dto/job.params';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post('ingest-pack/:id')
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
