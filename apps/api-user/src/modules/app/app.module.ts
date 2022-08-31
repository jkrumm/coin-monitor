import { TestModule } from './../test/test.module';
import { Module } from '@nestjs/common';

import { AppController } from 'apps/api-user/src/modules/app/app.controller';
import { AppService } from 'apps/api-user/src/modules/app/app.service';
import { DatabaseModule, RmqModule } from '@cm/api-common';
import { ConfigModule } from '@nestjs/config';
import { DATA_SERVICE } from 'apps/api-user/src/constants/services';
import * as Joi from 'joi';
import { AuthModule } from '@cm/api-user/modules/auth/auth.module';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
      isGlobal: true,
    }),
    RmqModule.register({ name: DATA_SERVICE }),
    DatabaseModule,
    TestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
