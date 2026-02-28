import { Controller, Post, Param, ValidationPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PackParamsDto } from '../packs/dto/pack.params';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post('ingest-pack/:id')
    async ingestPack(@Param(new ValidationPipe({ whitelist: true })) params: PackParamsDto) {
        // TODO: Phase 6 Admin Auth guard here
        return this.jobsService.ingestPack(params.id);
    }
}
