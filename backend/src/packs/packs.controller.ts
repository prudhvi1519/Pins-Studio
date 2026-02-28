import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, ValidationPipe, NotImplementedException } from '@nestjs/common';
import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { AddPackItemsDto } from './dto/add-pack-items.dto';
import { PackParamsDto } from './dto/pack.params';
import { PackQueryDto } from './dto/pack.query';

@Controller('packs')
export class PacksController {
    constructor(private readonly packsService: PacksService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
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
