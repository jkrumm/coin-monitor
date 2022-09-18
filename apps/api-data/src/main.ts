import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { RmqGuard } from '@cm/api-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new RmqGuard());

  // const port = process.env.PORT || 3334;
  await app.listen(3334);
  Logger.log(`🚀 api-data is running on: http://localhost:8000/`);
}

bootstrap();
