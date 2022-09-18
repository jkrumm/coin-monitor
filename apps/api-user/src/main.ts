import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // const port = process.env.PORT || 3333;
  await app.listen(3333);
  Logger.log(`🚀 api-user is running on: http://localhost:8000/`);
}

bootstrap();
