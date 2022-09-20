import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { queues } from '@cm/api-common';
import {
  MetricsQueueManager,
  MetricsQueueService,
} from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import { MetricsQueueProcessor } from '@cm/api-data/modules/metrics/processors/metrics.processor';
import { MetricsDebugController } from '@cm/api-data/modules/metrics/controllers/metrics-debug.controller';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';

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
