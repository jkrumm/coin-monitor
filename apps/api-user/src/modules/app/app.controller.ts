import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from 'apps/api-user/src/modules/app/app.service';
import {
  DoRpcMetadata,
  DoRpcPayload,
  MsgEventMetadata,
  MsgEventPayload,
  RmqMessage,
  RmqService,
} from '@cm/api-common';

@Controller('user-service')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  async getData() {
    const response = await this.rmqService.sendRequest<{ result: string }>(
      new RmqMessage(DoRpcMetadata, new DoRpcPayload('WORKS')),
    );
    this.logger.log('rpc ' + response.result);

    await this.rmqService.sendEvent(
      new RmqMessage(MsgEventMetadata, new MsgEventPayload('Hello World!')),
    );
    return this.appService.getData();
  }
}
