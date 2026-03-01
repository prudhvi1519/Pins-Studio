import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertUser(email: string, name?: string, avatarUrl?: string) {
        const defaultAdmins = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map((e) => e.trim().toLowerCase());
        const role = defaultAdmins.includes(email.trim().toLowerCase()) ? 'admin' : 'user';

        const user = await this.prisma.user.upsert({
            where: { email },
            update: {
                role,
                ...(name && { name }),
                ...(avatarUrl && { avatarUrl }),
            },
            create: {
                email,
                name,
                avatarUrl,
                role,
            },
        });

        return user;
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async registerUser(email: string, passwordHash: string, name?: string) {
        const defaultAdmins = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map((e) => e.trim().toLowerCase());
        const role = defaultAdmins.includes(email.trim().toLowerCase()) ? 'admin' : 'user';

        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            if (existingUser.passwordHash) {
                // Already registered with a password
                return null;
            }
            // Claim the account (e.g., from dev-login or future OAuth without password)
            return this.prisma.user.update({
                where: { email },
                data: {
                    passwordHash,
                    ...(name && { name }),
                    role,
                },
            });
        }

        // Create a brand new user
        return this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role,
            },
        });
    }
}
