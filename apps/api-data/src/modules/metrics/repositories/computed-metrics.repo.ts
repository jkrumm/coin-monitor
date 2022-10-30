import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComputedMetrics } from '@cm/api-data/modules/metrics/entities/computed-metrics.entity';

@Injectable()
export class ComputedMetricsRepo {
  private readonly logger = new Logger(ComputedMetricsRepo.name);

  constructor(
    @InjectRepository(ComputedMetrics)
    private readonly computedMetricsRepo: Repository<ComputedMetrics>,
  ) {}

  async getLatest(): Promise<ComputedMetrics | null> {
    return this.computedMetricsRepo
      .createQueryBuilder('computed_metrics')
      .orderBy('time', 'DESC')
      .getOne();
  }

  async getLatestDate(): Promise<string> {
    const mostRecentComputedMetrics = await this.getLatest();
    return mostRecentComputedMetrics !== null
      ? mostRecentComputedMetrics.date
      : '2010-07-18';
  }

  async getDescDates(): Promise<string[]> {
    const dates = await this.computedMetricsRepo
      .createQueryBuilder('computed_metrics')
      .select(['computed_metrics.date'])
      .orderBy('time', 'DESC')
      .getMany();
    return dates.map((item) => item.date);
  }

  async save(objects: ComputedMetrics[]) {
    await this.computedMetricsRepo.save(objects);
  }

  async update(date: string, partialComputedMetrics: Partial<ComputedMetrics>) {
    await this.computedMetricsRepo.update(date, partialComputedMetrics);
  }

  async getMetric(column: string) {
    const metric = await this.computedMetricsRepo
      .createQueryBuilder('computed_metrics')
      .select([`computed_metrics.${column}`])
      .where(`computed_metrics.${column} is not null`)
      .orderBy('time', 'ASC')
      .getMany();
    return metric.map((item) => item[column]);
  }
}
