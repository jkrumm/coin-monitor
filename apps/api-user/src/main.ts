import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RmqGuard } from '@cm/api-common';
import { AppModule } from '@cm/api-user/modules/app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalGuards(new RmqGuard());

  await app.listen(3333);
  Logger.log(`🚀 api-user is running on: http://localhost:8000/ | 3333`);
}

bootstrap();
