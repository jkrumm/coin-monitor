import { Controller, Get } from '@nestjs/common';
import { MetricsQueueService } from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import {
  ohlcJobMetadata,
  startPipelineJobMetadata,
} from '@cm/api-data/modules/metrics/constants/pipeline.constants';

@Controller('metrics-debug')
export class MetricsDebugController {
  constructor(private readonly metricsQueueService: MetricsQueueService) {}

  @Get('pipeline')
  async startPipeline(): Promise<void> {
    await this.metricsQueueService.add(
      startPipelineJobMetadata,
      { msg: 'test' },
      { attempts: 1 },
    );
  }

  @Get('ohlc')
  async startOHLC(): Promise<void> {
    await this.metricsQueueService.add(ohlcJobMetadata, undefined, { attempts: 1 });
  }
}
