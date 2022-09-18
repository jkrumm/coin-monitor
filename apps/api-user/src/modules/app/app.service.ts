import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { DoRpcMetadata, MsgEventMetadata, rmqQueues } from '@cm/api-common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @RabbitRPC({
    ...DoRpcMetadata,
    queue: rmqQueues.RPC,
  })
  public async rpcHandler({ msg }) {
    return {
      result: msg,
    };
  }

  @RabbitSubscribe({
    ...MsgEventMetadata,
    queue: rmqQueues.USER,
  })
  public async pubSubHandler({ msg }) {
    this.logger.log(`Received message: ${msg}`);
  }

  async getData(): Promise<{ message: string }> {
    return { message: 'Welcome to api-user!' };
  }
}
