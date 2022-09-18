import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from 'apps/api-user/src/modules/app/app.service';

@Controller('user-service')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService, // private readonly rmqService: RmqService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  /*@EventPattern(cmd.user.create)
  async MessagePattern(
    @Payload() data: CmdUserCreate,
    @Ctx() context: RmqContext,
  ): Promise<object> {
    this.logger.log('WORKS 2');
    this.logger.log(data);
    this.rmqService.ack(context);
    // throw new Error('expected');
    return { msg: 'test 2' };
  }*/
}
