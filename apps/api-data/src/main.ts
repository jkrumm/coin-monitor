import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { rmqQueues, RmqService } from '@cm/api-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(rmqQueues.DEFAULT));
  await app.startAllMicroservices();
  Logger.log(`🚀 api-data is running`);
}

bootstrap();
