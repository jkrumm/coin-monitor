import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { rmqConfig, RmqModule } from '@cm/api-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rmqConfig],
      isGlobal: true,
    }),
    RmqModule.register({
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
