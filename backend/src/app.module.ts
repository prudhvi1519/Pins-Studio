import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PinsModule } from './pins/pins.module';
import { BoardsModule } from './boards/boards.module';
import { PacksModule } from './packs/packs.module';
import { JobsModule } from './jobs/jobs.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RepairModule } from './repair/repair.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;
        const config: any = {
          throttlers: [{
            ttl: 300000, // 5 minutes (in ms for v6)
            limit: 30,
          }]
        };

        if (redisUrl) {
          // Provide the Redis storage options if REDIS_URL exists
          config.storage = new ThrottlerStorageRedisService(redisUrl);
        } else {
          console.warn('REDIS_URL is not set. Using in-memory throttler storage.');
        }

        return config;
      }
    }),
    PrismaModule,
    RedisModule,
    PinsModule,
    BoardsModule,
    PacksModule,
    JobsModule,
    AuthModule,
    UsersModule,
    RepairModule,
    AdminModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
