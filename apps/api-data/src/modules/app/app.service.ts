import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MsgEventMetadata, MsgEventPayload, rmqQueues } from '@cm/api-common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getData(): { message: string } {
    return { message: 'Welcome to api-data!' };
  }

  @RabbitSubscribe({
    ...MsgEventMetadata,
    queue: rmqQueues.DATA,
  })
  @UsePipes(ValidationPipe)
  public async pubSubHandler(@RabbitPayload() data: MsgEventPayload) {
    this.logger.log(`Received message: ${JSON.stringify(data)}`);
  }
}
