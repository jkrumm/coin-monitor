import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MsgEventMetadata, rmqQueues } from '@cm/api-common';

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
  public async pubSubHandler(data) {
    this.logger.log(`Received message: ${JSON.stringify(data)}`);
  }
}
