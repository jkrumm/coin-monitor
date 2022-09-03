import { TestModule } from './../test/test.module';
import { Module } from '@nestjs/common';

import { AppController } from 'apps/api-user/src/modules/app/app.controller';
import { AppService } from 'apps/api-user/src/modules/app/app.service';
import {
  databaseConfig,
  DatabaseModule,
  rmqConfig,
  RmqModule,
  rmqServices,
} from '@cm/api-common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@cm/api-user/modules/auth/auth.module';
import { authConfig } from '@cm/api-user/config/auth.config';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      load: [databaseConfig, rmqConfig, authConfig],
      isGlobal: true,
    }),
    RmqModule.register({ queue: rmqServices.DATA }),
    DatabaseModule,
    TestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
