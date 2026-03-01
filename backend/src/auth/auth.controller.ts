import { Controller, Post, Get, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/auth.dto';
import { setAuthCookies, clearAuthCookies } from './cookies.util';
import { JwtCookieGuard } from './guards/jwt-cookie.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('dev-login')
    async devLogin(@Body() dto: DevLoginDto, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.devLogin(dto);
        setAuthCookies(res, tokens.access, tokens.refresh);
        return user;
    }

    @UseGuards(JwtCookieGuard)
    @Get('me')
    async getMe(@Req() req: Request) {
        const payload = req.user as { sub: string };
        if (!payload || !payload.sub) {
            throw new UnauthorizedException();
        }

        // Fetch fresh user data so that allowlist role checks match DB reality
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        clearAuthCookies(res);
        return { ok: true };
    }
}
