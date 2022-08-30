import { Controller, Get } from '@nestjs/common';

import { AppService } from 'apps/api-user/src/modules/app/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
