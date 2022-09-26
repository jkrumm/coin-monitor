import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@cm/api-data/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(new RmqGuard());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3334);
  Logger.log(`🚀 api-data is running on: http://localhost:8000/ | 3334`);
}

bootstrap();
