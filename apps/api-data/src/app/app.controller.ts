import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { RmqService } from '@cm/api-common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { cmd, CmdAnalytics } from 'libs/api-common/src/rmq/rmg.transmitter';

@Controller('data-service')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern(cmd.analytics)
  async handleGetData(
    @Payload() data: CmdAnalytics,
    @Ctx() context: RmqContext,
  ): Promise<object> {
    this.logger.log('WORKS');
    this.logger.log(data);
    await this.rmqService.ack(context);
    return { msg: 'test 1' };
  }
}
