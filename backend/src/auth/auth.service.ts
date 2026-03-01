import { Injectable, ForbiddenException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { DevLoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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

    async register(dto: RegisterDto) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
        const passwordHash = await bcrypt.hash(dto.password, rounds);

        const user = await this.usersService.registerUser(dto.email, passwordHash, dto.name);
        if (!user) {
            throw new ConflictException('Email already registered');
        }

        return {
            user,
            tokens: this.generateTokens(user.id, user.email, user.role),
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Recalculate role on login
        const defaultAdmins = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
        user.role = defaultAdmins.includes(user.email.trim().toLowerCase()) ? 'admin' : 'user';

        return {
            user,
            tokens: this.generateTokens(user.id, user.email, user.role),
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'dev-secret-refresh',
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Recalculate role
            const defaultAdmins = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
            user.role = defaultAdmins.includes(user.email.trim().toLowerCase()) ? 'admin' : 'user';

            return { tokens: this.generateTokens(user.id, user.email, user.role) };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
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
