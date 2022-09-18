import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { RabbitPayload, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  DoRpcMetadata,
  DoRpcPayload,
  MsgEventMetadata,
  MsgEventPayload,
  rmqQueues,
} from '@cm/api-common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @RabbitRPC({
    ...DoRpcMetadata,
    queue: rmqQueues.RPC,
  })
  @UsePipes(ValidationPipe)
  public async rpcHandler(@RabbitPayload() { msg }: DoRpcPayload) {
    return {
      result: msg,
    };
  }

  @RabbitSubscribe({
    ...MsgEventMetadata,
    queue: rmqQueues.USER,
  })
  @UsePipes(ValidationPipe)
  public async pubSubHandler(@RabbitPayload() { msg }: MsgEventPayload) {
    this.logger.log(`Received message: ${msg}`);
  }

  async getData(): Promise<{ message: string }> {
    return { message: 'Welcome to api-user!' };
  }
}
