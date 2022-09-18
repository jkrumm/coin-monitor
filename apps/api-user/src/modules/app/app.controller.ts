import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from 'apps/api-user/src/modules/app/app.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Controller('user-service')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService, // private readonly rmqService: RmqService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get()
  async getData() {
    const response = await this.amqpConnection.request<{ response: string }>({
      exchange: 'exchange1',
      routingKey: 'rpc-route',
      payload: {
        msg: 'Hello World!',
      },
      timeout: 10000, // optional timeout for how long the request
      // should wait before failing if no response is received
    });
    this.logger.log('rpc', response.response);
    this.amqpConnection.publish('exchange1', 'subscribe-route', { msg: 'Hello World!' });
    return this.appService.getData();
  }

  /*@EventPattern(cmd.user.create)
  async MessagePattern(
    @Payload() data: CmdUserCreate,
    @Ctx() context: RmqContext,
  ): Promise<object> {
    this.logger.log('WORKS 2');
    this.logger.log(data);
    this.rmqService.ack(context);
    // throw new Error('expected');
    return { msg: 'test 2' };
  }*/
}
