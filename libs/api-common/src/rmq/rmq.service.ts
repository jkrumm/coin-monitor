import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { eventMap, RmqEvent, rmqTopics } from '@cm/api-common';
import { RequestOptions } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.interfaces';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendEvent(event: any) {
    const rmqEvent = await RmqService.rmqVT(event);
    this.amqpConnection.publish(rmqEvent.exchange, rmqEvent.routingKey, rmqEvent.message);
  }

  async sendRequest<T>(event: any): Promise<T> {
    const rmqRequest = await RmqService.rmqVTRequest(event);
    return await this.amqpConnection.request<T>(rmqRequest);
  }

  private static async rmqVT(payload: object): Promise<RmqEvent> {
    const eventType = payload.constructor.name;

    if (!eventMap.has(eventType)) {
      throw new Error('Invalid event validation - no type mapping');
    }

    const routingKey = eventMap.get(eventType)[1];

    const exchange = routingKey.split('.')[0];
    if (!Object.values<string>(rmqTopics).includes(exchange)) {
      throw new Error('Invalid event validation - invalid topic');
    }

    await validateOrReject(plainToClass(eventMap.get(eventType)[0], payload), {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    return {
      exchange,
      routingKey: routingKey,
      message: payload,
    };
  }

  private static async rmqVTRequest(payload: object): Promise<RequestOptions> {
    const rmqEvent = await this.rmqVT(payload);
    return {
      exchange: rmqEvent.exchange,
      routingKey: rmqEvent.routingKey,
      payload: rmqEvent.message,
      timeout: 10000,
      // correlationId: '',
      // expiration: undefined,
      // headers: undefined,
    };
  }
}
