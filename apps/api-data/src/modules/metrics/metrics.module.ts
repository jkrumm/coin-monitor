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
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { PipelineUtilService } from '@cm/api-data/modules/metrics/util/pipeline-util.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoinMetricsRaw]),
    BullModule.registerQueue(queues.metrics),
  ],
  controllers: [MetricsDebugController],
  providers: [
    MetricsService,
    MetricsQueueService,
    MetricsQueueProcessor,
    MetricsQueueManager,
    PipelineService,
    PipelineUtilService,
  ],
})
export class MetricsModule {}
