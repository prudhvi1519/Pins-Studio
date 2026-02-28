import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PinsModule } from './pins/pins.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, PinsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
