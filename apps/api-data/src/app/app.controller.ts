import {Controller, Get, Logger} from '@nestjs/common';

import {AppService} from './app.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {RmqService} from "@coin-monitor/api-common";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private readonly rmqService: RmqService) {
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('get_data')
  async handleGetData(@Payload() data: { msg: string }, @Ctx() context: RmqContext) {
    this.logger.log('WORKS');
    this.logger.log(data.msg);
    this.rmqService.ack(context);
  }
}
