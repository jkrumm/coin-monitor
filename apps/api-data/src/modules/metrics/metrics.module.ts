import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { queues } from '@cm/api-common';
import {
  MetricsQueueManager,
  MetricsQueueService,
} from 'apps/api-data/src/modules/metrics/processors/metrics-queue.manager';
import { MetricsQueueProcessor } from 'apps/api-data/src/modules/metrics/processors/metrics.processor';
import { MetricsDebugController } from 'apps/api-data/src/modules/metrics/controllers/metrics-debug.controller';
import { MetricsService } from 'apps/api-data/src/modules/metrics/services/metrics.service';

@Module({
  imports: [BullModule.registerQueue(queues.metrics)],
  controllers: [MetricsDebugController],
  providers: [
    MetricsService,
    MetricsQueueService,
    MetricsQueueProcessor,
    MetricsQueueManager,
  ],
})
export class MetricsModule {}
