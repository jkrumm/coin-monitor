import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {}

  @RabbitRPC({
    exchange: 'exchange1',
    routingKey: 'rpc-route',
    queue: 'rpc-queue',
  })
  public async rpcHandler({ msg }) {
    return {
      response: msg,
    };
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'subscribe-route',
    queue: 'user',
  })
  public async pubSubHandler({ msg }) {
    console.log(`Received message: ${msg}`);
  }

  async getData(): Promise<{ message: string }> {
    /*const payload1: CmdAnalytics = new CmdAnalytics(
      AnalyticsSources.AUTH,
      AnalyticsTypes.AUTH_LOGIN,
    );
    const reply1 = await rmqSend(this.client, cmd.analytics, payload1);
    const payload2: CmdUserCreate = new CmdUserCreate(
      '1fb1909b-1b45-484a-80ae-3591e32d8783',
    );
    const reply2 = await rmqEmit(this.client, cmd.user.create, payload2);
    // this.client.emit('event.test', { msg: 'Hello EventDriven World!' });

    this.logger.log('reply1 ' + reply1.toString());
    this.logger.log('reply2 ' + reply2);*/

    return { message: 'Welcome to api-user!' };
  }
}
