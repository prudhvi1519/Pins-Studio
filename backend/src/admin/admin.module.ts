import { DynamicModule } from '@nestjs/common';
import { AdminModule as BaseAdminModule } from '@adminjs/nestjs';
import * as AdminJSPrisma from '@adminjs/prisma';
import AdminJS from 'adminjs';

// Setup Prisma adapter for future resources
AdminJS.registerAdapter({
    Resource: AdminJSPrisma.Resource,
    Database: AdminJSPrisma.Database,
});

export class AdminModule {
    static register(): DynamicModule {
        if (process.env.ADMIN_PANEL_ENABLED !== 'true') {
            return { module: AdminModule };
        }

        return BaseAdminModule.createAdminAsync({
            useFactory: () => ({
                adminJsOptions: {
                    rootPath: '/admin',
                    branding: {
                        companyName: 'Pins Studio',
                        withMadeWithLove: false,
                    },
                },
                auth: {
                    authenticate: async (email, password) => {
                        if (
                            email === process.env.ADMIN_PANEL_EMAIL &&
                            password === process.env.ADMIN_PANEL_PASSWORD
                        ) {
                            return { email };
                        }
                        return null;
                    },
                    cookieName: 'adminjs',
                    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD || 'dev-fallback-cookie-password',
                },
            }),
        });
    }
}
