import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { Repository } from 'typeorm';
import {
  AvailableMetricsResponse,
  CoinMetricsRawResponse,
  requiredMetrics,
} from '@cm/api-data/modules/metrics/metrics.constants';
import { plainToInstance } from 'class-transformer';
import { get, toIsoDateString } from '@cm/api-common';
import { validateOrReject } from 'class-validator';

@Injectable()
export class PipelineUtilService {
  private readonly logger = new Logger(PipelineUtilService.name);

  constructor(
    @InjectRepository(CoinMetricsRaw)
    private readonly coinMetricsRawRepo: Repository<CoinMetricsRaw>,
  ) {}

  async getMostRecentPipelineRaw(): Promise<CoinMetricsRaw | null> {
    return this.coinMetricsRawRepo
      .createQueryBuilder('coin_metrics_raw')
      .orderBy('time', 'DESC')
      .getOne();
  }

  async getMostRecentDatePipelineRaw(): Promise<string> {
    const mostRecentCoinMetricsRaw = await this.getMostRecentPipelineRaw();
    return mostRecentCoinMetricsRaw !== null
      ? mostRecentCoinMetricsRaw.date
      : '2010-01-01';
  }

  async areMetricsAvailable(): Promise<boolean> {
    const response = (
      await get<AvailableMetricsResponse[]>(
        'https://availability.coinmetrics.io/public-api/availability',
      )
    ).filter(({ asset }) => asset === 'BTC')[0];

    return (
      toIsoDateString(response.updatedTime) === toIsoDateString(new Date()) &&
      requiredMetrics.every((v) => response.availableMetrics.includes(v))
    );
  }

  async getCoinMetricsRawResponse(
    mostRecentDate?: string,
  ): Promise<CoinMetricsRawResponse[]> {
    let startDate: string = mostRecentDate;
    if (mostRecentDate === undefined) {
      startDate = await this.getMostRecentDatePipelineRaw();
    }
    const rawResponse: CoinMetricsRawResponse[] = plainToInstance(
      CoinMetricsRawResponse,
      (
        await get<{ data: object[] }>(
          `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=${requiredMetrics.toString()}&frequency=1d&page_size=10000&start_time=${startDate}`,
        )
      ).data,
      { excludeExtraneousValues: true },
    ).map((v) => ({ ...v, date: toIsoDateString(v.time) }));
    rawResponse.map(async (v) => await validateOrReject(v));
    return rawResponse;
  }
}
