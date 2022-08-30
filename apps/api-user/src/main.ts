/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix(serverConfig.prefix);
  const globalPrefix = 'user';

  // app.setGlobalPrefix(globalPrefix);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 api-user is running on: http://localhost:8000/${globalPrefix}`);
}

bootstrap();
