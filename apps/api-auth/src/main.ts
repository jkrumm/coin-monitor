/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'auth';
  const port = process.env.PORT || 3334;
  await app.listen(port);
  Logger.log(`🚀 api-auth is running on: http://localhost:8000/${globalPrefix}`);
}

bootstrap();
