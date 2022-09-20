import { Module } from '@nestjs/common';

import { AppController } from '@cm/api-data/modules/app/app.controller';
import { AppService } from '@cm/api-data/modules/app/app.service';
import { ConfigModule } from '@nestjs/config';
import {
  QueueModule,
  redisConfig,
  rmqConfig,
  rmqExchanges,
  RmqModule,
  SqliteModule,
} from '@cm/api-common';
import { MetricsModule } from '@cm/api-data/modules/metrics/metrics.module';
import { TestModule } from '@cm/api-data/modules/test/test.module';

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
    TestModule,
    SqliteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
