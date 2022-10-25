import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '@cm/api-data/modules/metrics/services/metrics.service';
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { BaseMetric } from '@cm/types';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('raw-coinmetrics')
  async fetchRawCoinsMetrics(): Promise<CoinMetricsRaw> {
    return await this.metricsService.fetchRawCoinsMetrics();
  }

  @Get('price-usd')
  async fetchPriceUsd(): Promise<BaseMetric> {
    return await this.metricsService.fetchPriceUsd();
  }
}
