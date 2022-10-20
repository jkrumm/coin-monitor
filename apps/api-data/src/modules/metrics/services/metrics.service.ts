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
}
