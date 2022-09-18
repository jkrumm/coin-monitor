import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RmqMessage } from '@cm/api-common';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendEvent(event: RmqMessage) {
    try {
      const rmqEvent = await event.toEvent();
      this.amqpConnection.publish(
        rmqEvent.exchange,
        rmqEvent.routingKey,
        rmqEvent.message,
      );
    } catch (e) {
      this.logger.error('sendEvent failed', {
        error: JSON.stringify(e),
        exchange: event.meta.exchange,
        routingKey: event.meta.routingKey,
        payload: event.payload,
      });
      throw e;
    }
  }

  async sendRequest<T>(event: RmqMessage, timeout?: number): Promise<T> {
    try {
      const rmqRequest = await event.toRequest(timeout);
      return await this.amqpConnection.request<T>(rmqRequest);
    } catch (e) {
      this.logger.error('sendRequest failed', {
        error: JSON.stringify(e),
        exchange: event.meta.exchange,
        routingKey: event.meta.routingKey,
        payload: event.payload,
      });
      throw e;
    }
  }
}
