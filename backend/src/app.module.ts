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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;
        const throttlerOptions: any = {
          ttl: 300, // 5 minutes 
          limit: 30, // 30 requests
        };

        if (redisUrl) {
          throttlerOptions.storage = new ThrottlerStorageRedisService(redisUrl);
        } else {
          console.warn('REDIS_URL is not set. Using in-memory throttler storage.');
        }

        return throttlerOptions;
      }
    }),
    PrismaModule,
    RedisModule,
    PinsModule,
    BoardsModule,
    PacksModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
