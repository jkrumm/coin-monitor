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
import { PipelineService } from '@cm/api-data/modules/metrics/services/pipeline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmRawMetrics } from '@cm/api-data/modules/metrics/entities/cm-raw-metrics.entity';
import { OhlcService } from '@cm/api-data/modules/metrics/services/ohlc.service';
import { MetricsController } from '@cm/api-data/modules/metrics/controllers/metrics.controller';
import { PricePipelineService } from '@cm/api-data/modules/metrics/services/price-pipeline.service';
import { ComputedMetrics } from '@cm/api-data/modules/metrics/entities/computed-metrics.entity';
import { CmRawMetricsRepo } from '@cm/api-data/modules/metrics/repositories/cm-raw-metrics.repo';
import { ComputedMetricsRepo } from '@cm/api-data/modules/metrics/repositories/computed-metrics.repo';
import { MetricsEventRepo } from '@cm/api-data/modules/metrics/repositories/metrics-event.repo';
import { MetricsEvent } from '@cm/api-data/modules/metrics/entities/metrics-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CmRawMetrics, ComputedMetrics, MetricsEvent]),
    BullModule.registerQueue(queues.metrics),
  ],
  controllers: [MetricsController, MetricsDebugController],
  providers: [
    MetricsService,
    MetricsQueueService,
    MetricsQueueProcessor,
    MetricsQueueManager,
    PipelineService,
    OhlcService,
    PricePipelineService,
    CmRawMetricsRepo,
    ComputedMetricsRepo,
    MetricsEventRepo,
  ],
})
export class MetricsModule {}
