import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IngestionQueueService } from './queue/queue';
import { IngestionWorkerService } from './queue/worker';

@Module({
    imports: [PrismaModule],
    controllers: [JobsController],
    providers: [JobsService, IngestionQueueService, IngestionWorkerService],
    exports: [JobsService],
})
export class JobsModule { }
