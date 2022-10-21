import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinMetricsRaw } from '../entities/coin-metrics-raw.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(CoinMetricsRaw)
    private readonly coinMetricsRawRepo: Repository<CoinMetricsRaw>,
  ) {}

  async doFirstJob(msg: string) {
    this.logger.log('doFirstJob ' + msg);
  }

  async fetchRawCoinsMetrics() {
    return await this.coinMetricsRawRepo
      .createQueryBuilder('coin_metrics_raw')
      .orderBy('time', 'DESC')
      .getOne();
  }

  async fetchPriceUsd(): Promise<CoinMetricsRaw[]> {
    return await this.coinMetricsRawRepo
      .createQueryBuilder('coin_metrics_raw')
      .select(['coin_metrics_raw.time', 'coin_metrics_raw.PriceUSD'])
      .where('coin_metrics_raw.time > :start_at', {
        start_at: '2011-01-01  10:41:30.746877',
      })
      .orderBy('time', 'DESC')
      .getMany();
  }
}
