import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as { sub: string; email: string; role: string };

        if (!user) {
            throw new UnauthorizedException('User session not found');
        }

        if (user.role !== 'admin') {
            throw new ForbiddenException('Admin role required');
        }

        return true;
    }
}
