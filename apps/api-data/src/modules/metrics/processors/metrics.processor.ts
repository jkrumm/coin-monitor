import { Process, Processor } from '@nestjs/bull';
import { queues } from '@cm/api-common';
import { Job } from 'bull';
import {
  fetchCoinMetricsJobMetadata,
  FetchCoinMetricsJobPayload,
  startPipelineJobMetadata,
  StartPipelineJobPayload,
} from '@cm/api-data/modules/metrics/constants/pipeline.constants';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';
import { PipelineService } from '@cm/api-data/modules/metrics/services/pipeline.service';

@Processor(queues.metrics.name)
export class MetricsQueueProcessor {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly pipelineService: PipelineService,
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
    await this.pipelineService.fetchCoinMetrics(date);
  }
}
