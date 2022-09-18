import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to api-data!' };
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'subscribe-route',
    queue: 'data',
  })
  public async pubSubHandler({ msg }) {
    console.log(`Received message: ${msg}`);
  }
}
