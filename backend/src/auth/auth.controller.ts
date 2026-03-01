import { Controller, Post, Get, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { COOKIE_NAMES, setAuthCookies, clearAuthCookies } from './cookies.util';
import { JwtCookieGuard } from './guards/jwt-cookie.guard';
import { GoogleOAuthGuard } from './guards/google.guard';
import { UsersService } from '../users/users.service';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Req() req: Request) {
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.googleLogin(req.user);
        setAuthCookies(res, tokens.access, tokens.refresh);
        res.redirect(process.env.APP_URL || 'http://localhost:5173');
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.register(dto);
        setAuthCookies(res, tokens.access, tokens.refresh);
        return user;
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { user, tokens } = await this.authService.login(dto);
        setAuthCookies(res, tokens.access, tokens.refresh);
        return user;
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH];
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        const { tokens } = await this.authService.refresh(refreshToken);
        setAuthCookies(res, tokens.access, tokens.refresh);
        return { ok: true };
    }

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
