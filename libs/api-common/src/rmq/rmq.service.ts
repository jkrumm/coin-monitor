import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RmqMessage, RmqMessageMetadata } from '@cm/api-common';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendEvent(metadata: RmqMessageMetadata, payload: object) {
    const rmqMessage = new RmqMessage(metadata, payload);
    try {
      const rmqEvent = await rmqMessage.toEvent();
      this.amqpConnection.publish(
        rmqEvent.exchange,
        rmqEvent.routingKey,
        rmqEvent.message,
      );
    } catch (e) {
      this.logger.error('sendEvent failed', {
        error: JSON.stringify(e),
        exchange: rmqMessage.meta.exchange,
        routingKey: rmqMessage.meta.routingKey,
        payload: JSON.stringify(rmqMessage.payload),
      });
      throw e;
    }
  }

  async sendRequest<T>(
    metadata: RmqMessageMetadata,
    payload: object,
    timeout?: number,
  ): Promise<T> {
    const rmqMessage = new RmqMessage(metadata, payload);
    try {
      const rmqRequest = await rmqMessage.toRequest(timeout);
      return await this.amqpConnection.request<T>(rmqRequest);
    } catch (e) {
      this.logger.error('sendRequest failed', {
        error: JSON.stringify(e),
        exchange: rmqMessage.meta.exchange,
        routingKey: rmqMessage.meta.routingKey,
        payload: JSON.stringify(rmqMessage.payload),
      });
      throw e;
    }
  }
}
