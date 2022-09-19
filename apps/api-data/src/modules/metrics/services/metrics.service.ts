import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor() {}

  async doFirstJob(msg: string) {
    this.logger.log('doFirstJob ' + msg);
  }
}
