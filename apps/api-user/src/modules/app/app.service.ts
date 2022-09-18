import { Inject, Injectable, Logger } from '@nestjs/common';
import { rmqQueues } from '@cm/api-common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(rmqQueues.DEFAULT)
    private client: ClientProxy,
  ) {}

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
