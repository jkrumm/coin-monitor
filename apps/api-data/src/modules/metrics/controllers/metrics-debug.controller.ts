import { Controller, Get } from '@nestjs/common';
import {
  firstJobMetadata,
  MetricsQueueService,
} from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';

@Controller('metrics-debug')
export class MetricsDebugController {
  constructor(private readonly metricsQueueService: MetricsQueueService) {}

  @Get()
  async testQueue(): Promise<void> {
    await this.metricsQueueService.add(firstJobMetadata, { msg: 'test' });
  }
}
