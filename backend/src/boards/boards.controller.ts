import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardParamsDto, BoardPinParamsDto, BoardsQueryDto } from './dto/board.params';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body(new ValidationPipe({ whitelist: true })) createBoardDto: CreateBoardDto) {
        return this.boardsService.create(createBoardDto);
    }

    @Get()
    findAll(@Query(new ValidationPipe({ transform: true })) query: BoardsQueryDto) {
        return this.boardsService.findAll(query.userId);
    }

    @Get(':id')
    findOne(@Param(new ValidationPipe({ whitelist: true })) params: BoardParamsDto) {
        return this.boardsService.findOne(params.id);
    }

    @Patch(':id')
    update(
        @Param(new ValidationPipe({ whitelist: true })) params: BoardParamsDto,
        @Body(new ValidationPipe({ whitelist: true })) updateBoardDto: UpdateBoardDto,
    ) {
        return this.boardsService.update(params.id, updateBoardDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param(new ValidationPipe({ whitelist: true })) params: BoardParamsDto) {
        return this.boardsService.remove(params.id);
    }

    @Post(':id/pins/:pinId')
    assignPin(@Param(new ValidationPipe({ whitelist: true })) params: BoardPinParamsDto) {
        return this.boardsService.assignPin(params.id, params.pinId);
    }

    @Delete(':id/pins/:pinId')
    @HttpCode(HttpStatus.NO_CONTENT)
    unassignPin(@Param(new ValidationPipe({ whitelist: true })) params: BoardPinParamsDto) {
        return this.boardsService.unassignPin(params.id, params.pinId);
    }
}
