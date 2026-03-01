import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DevLoginDto } from './dto/auth.dto';
import { JwtPayload, JWT_CONFIG } from './jwt.util';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async devLogin(dto: DevLoginDto) {
        if (process.env.AUTH_DEV_LOGIN !== 'true') {
            throw new ForbiddenException('Dev login is disabled');
        }

        const startUser = await this.usersService.upsertUser(dto.email, dto.name, dto.avatarUrl);

        return {
            user: startUser,
            tokens: this.generateTokens(startUser.id, startUser.email, startUser.role),
        };
    }

    private generateTokens(userId: string, email: string, role: string) {
        const payload: JwtPayload = { sub: userId, email, role };

        const access = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET || 'dev-secret-access',
            expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN as any,
        });

        const refresh = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'dev-secret-refresh',
            expiresIn: JWT_CONFIG.REFRESH_EXPIRES_IN as any,
        });

        return { access, refresh };
    }
}
