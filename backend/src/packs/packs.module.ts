import { Module } from '@nestjs/common';
import { PacksService } from './packs.service';
import { PacksController, JobsController } from './packs.controller';

@Module({
    controllers: [PacksController, JobsController],
    providers: [PacksService],
    exports: [PacksService],
})
export class PacksModule { }
