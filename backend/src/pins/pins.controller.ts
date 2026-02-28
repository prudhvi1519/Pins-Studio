import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { PinsService } from './pins.service';
import { FeedQueryDto } from './dto/feed.query';

import { Body, Post, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';
import { PinParamsDto } from './dto/pin.params';

@Controller('pins')
export class PinsController {
    constructor(private readonly pinsService: PinsService) { }

    @Get()
    getFeed(@Query(new ValidationPipe({ transform: true })) query: FeedQueryDto) {
        return this.pinsService.getFeed(query);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body(new ValidationPipe({ whitelist: true })) createPinDto: CreatePinDto) {
        return this.pinsService.create(createPinDto);
    }

    @Get(':id')
    findOne(@Param(new ValidationPipe({ whitelist: true })) params: PinParamsDto) {
        return this.pinsService.findOne(params.id);
    }

    @Patch(':id')
    update(
        @Param(new ValidationPipe({ whitelist: true })) params: PinParamsDto,
        @Body(new ValidationPipe({ whitelist: true })) updatePinDto: UpdatePinDto,
    ) {
        return this.pinsService.update(params.id, updatePinDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param(new ValidationPipe({ whitelist: true })) params: PinParamsDto) {
        return this.pinsService.remove(params.id);
    }
}
