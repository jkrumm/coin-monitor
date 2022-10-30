import { Process, Processor } from '@nestjs/bull';
import { queues } from '@cm/api-common';
import { Job } from 'bull';
import {
  calculatePiCycleMetadata,
  fetchCoinMetricsJobMetadata,
  FetchCoinMetricsJobPayload,
  startPipelineJobMetadata,
  StartPipelineJobPayload,
} from '@cm/api-data/modules/metrics/constants/pipeline.constants';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';
import { PipelineService } from '@cm/api-data/modules/metrics/services/pipeline.service';
import { OhlcService } from '@cm/api-data/modules/metrics/services/ohlc.service';
import { PricePipelineService } from '@cm/api-data/modules/metrics/services/price-pipeline.service';

@Processor(queues.metrics.name)
export class MetricsQueueProcessor {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly pipelineService: PipelineService,
    private readonly ohlcService: OhlcService,
    private readonly pricePipelineService: PricePipelineService,
  ) {}

  @Process({
    name: startPipelineJobMetadata.name,
    concurrency: 0,
  })
  async startPipeline({ data: { msg } }: Job<StartPipelineJobPayload>): Promise<void> {
    await this.pipelineService.startPipeline();
  }

  @Process({
    name: fetchCoinMetricsJobMetadata.name,
    concurrency: 0,
  })
  async fetchCoinMetrics({
    data: { date },
  }: Job<FetchCoinMetricsJobPayload>): Promise<void> {
    await this.pipelineService.loadCmRaw(date);
    await this.pipelineService.prepareComputedMetrics();
    await this.pipelineService.startPriceJobs();
  }

  @Process({
    name: calculatePiCycleMetadata.name,
    concurrency: 0,
  })
  async startOhlc(): Promise<void> {
    await this.pricePipelineService.calculatePiCycle();
  }
}
