import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { rmqEvents, rmqQueues, rmqTopics } from '@cm/api-common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @RabbitRPC({
    exchange: rmqTopics.AUTH,
    routingKey: rmqEvents.AUTH_RPC_DO,
    queue: rmqQueues.RPC,
  })
  public async rpcHandler({ msg }) {
    return {
      result: msg,
    };
  }

  @RabbitSubscribe({
    exchange: rmqTopics.AUTH,
    routingKey: rmqEvents.AUTH_MSG,
    queue: rmqQueues.USER,
  })
  public async pubSubHandler({ msg }) {
    this.logger.log(`Received message: ${msg}`);
  }

  async getData(): Promise<{ message: string }> {
    return { message: 'Welcome to api-user!' };
  }
}
