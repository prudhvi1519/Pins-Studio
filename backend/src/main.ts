import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors';
import { ENV } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(corsConfig);
  await app.listen(ENV.PORT);
}
bootstrap();
