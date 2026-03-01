import { Controller, Post, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairSuggestionsDto, ApplyRepairDto } from './dto/repair.dto';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';

@Controller('pins/:id/repair')
@UseGuards(JwtCookieGuard) // Optional based on requirements, assuming we protect mutating features
export class RepairController {
    constructor(private readonly repairService: RepairService) { }

    @Post('suggestions')
    @HttpCode(HttpStatus.OK)
    async getSuggestions(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: RepairSuggestionsDto
    ) {
        const suggestions = await this.repairService.getSuggestions(id);
        return {
            pinId: id,
            suggestions
        };
    }

    @Post('apply')
    @HttpCode(HttpStatus.OK)
    async applyRepair(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: ApplyRepairDto
    ) {
        return this.repairService.applyRepair(id, dto.sourcePinId);
    }
}
