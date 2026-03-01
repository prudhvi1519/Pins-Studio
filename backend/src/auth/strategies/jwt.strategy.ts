import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { COOKIE_NAMES } from '../cookies.util';
import { JwtPayload } from '../jwt.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                if (req && req.cookies) {
                    return req.cookies[COOKIE_NAMES.ACCESS] || null;
                }
                return null;
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod-if-missing',
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload.sub) {
            throw new UnauthorizedException();
        }
        return payload; // populated into req.user
    }
}
