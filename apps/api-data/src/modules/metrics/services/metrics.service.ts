import { Injectable, Logger } from '@nestjs/common';
import { BaseMetric, PyCycleMetric } from '@cm/types';
import { CmRawMetricsRepo } from '@cm/api-data/modules/metrics/repositories/cm-raw-metrics.repo';
import { ComputedMetricsRepo } from '../repositories/computed-metrics.repo';
import { MetricsEventRepo } from '@cm/api-data/modules/metrics/repositories/metrics-event.repo';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmRawMetrics } from '@cm/api-data/modules/metrics/entities/cm-raw-metrics.entity';
import { MetricsEventType } from '@cm/api-data/modules/metrics/entities/metrics-event.entity';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(CmRawMetrics)
    private readonly coinMetricsRawRepo: Repository<CmRawMetrics>,
    private readonly cmRawMetricsRepo: CmRawMetricsRepo,
    private readonly computedMetricsRepo: ComputedMetricsRepo,
    private readonly metricsEventRepo: MetricsEventRepo,
  ) {}

  async doFirstJob(msg: string) {
    this.logger.log('doFirstJob ' + msg);
  }

  async fetchLatestCmRaw() {
    return await this.cmRawMetricsRepo.getLatest();
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
      d: item.date,
      c: item.PriceUSD,
    }));

    const events = [];
    for (const event of eventsRaw) {
      const itemIndex = btc.findIndex((item) => item.d === event.date);
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

  async fetchPyCycleMetric(): Promise<PyCycleMetric> {
    const btc = await this.cmRawMetricsRepo.getPriceData();
    const eventsRaw = await this.metricsEventRepo.getByType(MetricsEventType.PY_CYCLE);
    const events = [];
    for (const event of eventsRaw) {
      const itemIndex = btc.findIndex((item) => item.d === event.date);
      if (itemIndex === -1) {
        throw new Error('Date not found');
      }
      events.push({
        d: event.date,
        c: event.btcClose,
        i: itemIndex,
        s: event.signal,
      });
    }

    return {
      btc,
      events,
      pyCycleBottom: {
        long: await this.computedMetricsRepo.getMetric('pyCycleBottomLong'),
        short: await this.computedMetricsRepo.getMetric('pyCycleBottomShort'),
      },
      pyCycleTop: {
        long: await this.computedMetricsRepo.getMetric('pyCycleTopLong'),
        short: await this.computedMetricsRepo.getMetric('pyCycleTopShort'),
      },
    };
  }
}
