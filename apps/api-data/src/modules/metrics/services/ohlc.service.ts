import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OhlcService {
  private readonly logger = new Logger(OhlcService.name);

  constructor() {}

  async startOhlc() {
    this.logger.log('startOhlc');
  }
}
