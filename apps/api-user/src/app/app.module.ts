import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {RmqModule} from "@coin-monitor/api-common";
import {ConfigModule} from "@nestjs/config";
import {DATA_SERVICE} from "apps/api-user/src/constants/services";

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), RmqModule.register({name: DATA_SERVICE})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
