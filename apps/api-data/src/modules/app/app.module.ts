import { Module } from '@nestjs/common';

import { AppController } from 'apps/api-data/src/modules/app/app.controller';
import { AppService } from 'apps/api-data/src/modules/app/app.service';
import { ConfigModule } from '@nestjs/config';
import {
  QueueModule,
  redisConfig,
  rmqConfig,
  rmqExchanges,
  RmqModule,
} from '@cm/api-common';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rmqConfig, redisConfig],
      isGlobal: true,
    }),
    RmqModule.register({
      exchanges: [rmqExchanges.AUTH],
    }),
    QueueModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
