import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { rmqConfig, rmqExchanges, RmqModule } from '@cm/api-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rmqConfig],
      isGlobal: true,
    }),
    RmqModule.register({
      exchanges: [rmqExchanges.AUTH],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
