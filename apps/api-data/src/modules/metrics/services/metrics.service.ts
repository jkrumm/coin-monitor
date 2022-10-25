import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinMetricsRaw } from '../entities/coin-metrics-raw.entity';
import { Repository } from 'typeorm';
import { BaseMetric } from '@cm/types';

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

  async fetchPriceUsd(): Promise<BaseMetric> {
    const cmRaw = await this.coinMetricsRawRepo
      .createQueryBuilder('coin_metrics_raw')
      .select(['coin_metrics_raw.date', 'coin_metrics_raw.PriceUSD'])
      .where('coin_metrics_raw.time > :start_at', {
        start_at: '2011-01-01  10:41:30.746877',
      })
      .orderBy('time', 'ASC')
      .getMany();

    const eventsRaw = [
      {
        date: '2013-12-05',
        type: 'sell',
      },
      {
        date: '2015-01-14',
        type: 'buy',
      },
      {
        date: '2017-12-16',
        type: 'sell',
      },
      {
        date: '2018-12-16',
        type: 'buy',
      },
      {
        date: '2021-04-17',
        type: 'sell',
      },
    ];

    const btc = cmRaw.map((item) => ({
      date: item.date,
      close: Math.round(parseFloat(item.PriceUSD) * 100) / 100,
    }));

    const events = [];
    for (const event of eventsRaw) {
      const itemIndex = btc.findIndex((item) => item.date === event.date);
      if (itemIndex === -1) {
        throw new Error('Date not found');
      }
      const item = cmRaw[itemIndex];
      events.push({
        date: item.date,
        close: item.PriceUSD,
        index: itemIndex,
        type: event.type,
      });
    }

    return { btc, events };
  }
}
