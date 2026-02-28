import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, ValidationPipe, NotImplementedException } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { AddPackItemsDto } from './dto/add-pack-items.dto';
import { PackParamsDto } from './dto/pack.params';
import { PackQueryDto } from './dto/pack.query';

@Controller('packs')
// Skip default throttling globally to this controller if we had one, but we apply strictly
export class PacksController {
    constructor(private readonly packsService: PacksService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute 
    create(@Body(new ValidationPipe({ whitelist: true })) createPackDto: CreatePackDto) {
        // TODO: Phase 6 Admin Auth guard here
        return this.packsService.create(createPackDto);
    }

    @Get()
    findAll() {
        return this.packsService.findAll();
    }

    @Post(':id/items')
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 pack item pushes per min
    addItems(
        @Param(new ValidationPipe({ whitelist: true })) params: PackParamsDto,
        @Body(new ValidationPipe({ whitelist: true })) addPackItemsDto: AddPackItemsDto
    ) {
        // TODO: Phase 6 Admin Auth guard here
        return this.packsService.addItems(params.id, addPackItemsDto);
    }

    @Get(':id/items')
    findItems(
        @Param(new ValidationPipe({ whitelist: true })) params: PackParamsDto,
        @Query(new ValidationPipe({ transform: true })) query: PackQueryDto
    ) {
        return this.packsService.findItems(params.id, query.status);
    }
}
