import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';
import { CmRawMetrics } from '@cm/api-data/modules/metrics/entities/cm-raw-metrics.entity';
import { BaseMetric } from '@cm/types';
import { MetricsEventType } from '@cm/api-data/modules/metrics/entities/metrics-event.entity';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('raw-coinmetrics')
  async fetchLatestCmRaw(): Promise<CmRawMetrics> {
    return await this.metricsService.fetchLatestCmRaw();
  }

  @Get('price-usd')
  async fetchPriceUsd(): Promise<BaseMetric> {
    return await this.metricsService.fetchPriceUsd();
  }

  @Get(MetricsEventType.PY_CYCLE)
  async fetchPyCycleMetric(): Promise<BaseMetric> {
    return await this.metricsService.fetchPyCycleMetric();
  }
}
