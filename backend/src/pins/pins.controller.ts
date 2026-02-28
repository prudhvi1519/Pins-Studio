import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { PinsService } from './pins.service';
import { FeedQueryDto } from './dto/feed.query';

@Controller('pins')
export class PinsController {
    constructor(private readonly pinsService: PinsService) { }

    @Get()
    getFeed(@Query(new ValidationPipe({ transform: true })) query: FeedQueryDto) {
        return this.pinsService.getFeed(query);
    }
}
