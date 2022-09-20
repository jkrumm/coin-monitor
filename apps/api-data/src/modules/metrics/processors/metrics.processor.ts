import { Process, Processor } from '@nestjs/bull';
import { queues } from '@cm/api-common';
import { Job } from 'bull';
import {
  firstJobMetadata,
  FirstJobPayload,
} from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';

@Processor(queues.metrics.name)
export class MetricsQueueProcessor {
  constructor(private readonly metricsService: MetricsService) {}

  @Process({
    name: firstJobMetadata.name,
    concurrency: 0,
  })
  async firstJob({ data: { msg } }: Job<FirstJobPayload>): Promise<void> {
    await this.metricsService.doFirstJob(msg);
  }
}
