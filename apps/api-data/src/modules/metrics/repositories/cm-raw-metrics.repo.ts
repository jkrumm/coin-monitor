import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CmRawMetrics } from '@cm/api-data/modules/metrics/entities/cm-raw-metrics.entity';
import { Repository } from 'typeorm';
import { CmRawMetricsResponse } from '@cm/api-data/modules/metrics/constants/metrics.constants';
import { round } from '@cm/api-common';
import { PriceData } from '@cm/types';

@Injectable()
export class CmRawMetricsRepo {
  private readonly logger = new Logger(CmRawMetricsRepo.name);

  constructor(
    @InjectRepository(CmRawMetrics)
    private readonly cmRawRepo: Repository<CmRawMetrics>,
  ) {}

  async getLatest(): Promise<CmRawMetrics | null> {
    return this.cmRawRepo
      .createQueryBuilder('cm_raw_metrics')
      .orderBy('time', 'DESC')
      .getOne();
  }

  async getLatestDate(): Promise<string> {
    const mostRecentCmRaw = await this.getLatest();
    return mostRecentCmRaw !== null ? mostRecentCmRaw.date : '2010-07-18';
  }

  async save(objects: CmRawMetricsResponse[]) {
    const mapped = objects.map((item) => ({
      ...item,
      PriceUSD: round(item.PriceUSD, 4),
    }));
    await this.cmRawRepo.save(mapped);
  }

  async getPriceData(): Promise<PriceData[]> {
    const cmRaw = await this.cmRawRepo
      .createQueryBuilder('cm_raw_metrics')
      .select(['cm_raw_metrics.date', 'cm_raw_metrics.PriceUSD'])
      .where('cm_raw_metrics.PriceUSD is not null')
      .orderBy('time', 'ASC')
      .getMany();

    return cmRaw.map((item) => ({
      d: item.date,
      c: item.PriceUSD,
    }));
  }
}
