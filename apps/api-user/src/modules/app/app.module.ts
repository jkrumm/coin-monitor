import { Module } from '@nestjs/common';

import { AppController } from '@cm/api-user/modules/app/app.controller';
import { AppService } from '@cm/api-user/modules/app/app.service';
import {
  databaseConfig,
  DatabaseModule,
  rmqConfig,
  rmqExchanges,
  RmqModule,
} from '@cm/api-common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@cm/api-user/modules/auth/auth.module';
import { TestModule } from '@cm/api-user/modules/test/test.module';
import { authConfig } from '@cm/api-user/config/auth.config';

// for user module
// https://stackoverflow.com/questions/60254371/authentication-roles-with-guards-decorators-how-to-pass-user-object

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, rmqConfig, authConfig],
      isGlobal: true,
    }),
    RmqModule.register({
      exchanges: [rmqExchanges.AUTH],
    }),
    DatabaseModule,
    TestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
