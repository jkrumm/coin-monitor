import {
  days,
  get,
  JobMetadata,
  toDateTime,
  todayDateTime,
  toIsoDateString,
} from '@cm/api-common';
import { Injectable, Logger } from '@nestjs/common';
import { MetricsQueueService } from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import { DateTime, Interval } from 'luxon';
import {
  calculatePiCycleMetadata,
  fetchCoinMetricsJobMetadata,
} from '@cm/api-data/modules/metrics/constants/pipeline.constants';
import { queueDataJobGroup } from '@cm/api-data/constants/api-data.constants';
import { CmRawMetricsRepo } from '@cm/api-data/modules/metrics/repositories/cm-raw-metrics.repo';
import {
  AvailableMetricsResponse,
  CmRawMetricsResponse,
  requiredMetrics,
} from '@cm/api-data/modules/metrics/constants/metrics.constants';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ComputedMetricsRepo } from '@cm/api-data/modules/metrics/repositories/computed-metrics.repo';
import { ComputedMetrics } from '../entities/computed-metrics.entity';

const jobGroup = queueDataJobGroup.METRICS_PIPELINE;

class PipelineStatus {
  date: string | null = null;
}

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);
  pipelineStatus: PipelineStatus = new PipelineStatus();

  constructor(
    private readonly metricsQueueService: MetricsQueueService,
    private readonly cmRawRepo: CmRawMetricsRepo,
    private readonly computedMetricsRepo: ComputedMetricsRepo,
  ) {}

  // TODO: schedule at 1am
  async startPipeline() {
    const date = DateTime.now().minus({ day: 1 }).toISODate();
    if ((await this.fetchMetricsAvailable()) === true) {
      this.logger.log('startPipeline - metrics available', { jobDate: date, jobGroup });
      await this.metricsQueueService.add(
        fetchCoinMetricsJobMetadata,
        { date },
        { attempts: 1 },
      );
      this.logger.log('startPipeline - pipeline started', { jobDate: date, jobGroup });
      return;
    }
    this.logger.log('startPipeline - metrics unavailable', { jobDate: date, jobGroup });
  }

  async loadCmRaw(date: string) {
    const latestDateCmRaw = await this.cmRawRepo.getLatestDate();

    if (toIsoDateString(date) === toIsoDateString(latestDateCmRaw)) {
      this.logger.log('fetchCoinMetrics - already done this date', {
        jobDate: date,
        mostRecentDate: latestDateCmRaw,
        jobGroup,
      });
      return;
    }

    const rawResponse = await this.fetchCmRaw(latestDateCmRaw);

    this.logger.log('fetchCoinMetrics - new entries', {
      amountOfNewEntries: rawResponse.length - 1,
      jobDate: date,
      latestDateCmRaw: latestDateCmRaw,
      jobGroup,
    });

    await this.cmRawRepo.save(rawResponse);

    const latestDateComputedMetrics = await this.computedMetricsRepo.getLatestDate();
  }

  async fetchMetricsAvailable(): Promise<boolean> {
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

  async fetchCmRaw(mostRecentDate?: string): Promise<CmRawMetricsResponse[]> {
    let startDate: string = mostRecentDate;
    if (mostRecentDate === undefined) {
      startDate = await this.cmRawRepo.getLatestDate();
    }
    const rawResponse: CmRawMetricsResponse[] = plainToInstance(
      CmRawMetricsResponse,
      (
        await get<{ data: object[] }>(
          `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=${requiredMetrics.toString()}&frequency=1d&page_size=10000&start_time=${startDate}`,
        )
      ).data,
      { excludeExtraneousValues: true },
    ).map((v) => ({ ...v, date: toIsoDateString(v.time) }));
    for (const v of rawResponse) {
      await validateOrReject(v);
    }
    return rawResponse;
  }

  async prepareComputedMetrics() {
    const latestDate = toDateTime(await this.computedMetricsRepo.getLatestDate());
    const todayDate = todayDateTime();
    const interval = Interval.fromDateTimes(latestDate, todayDate);

    for (let date of days(interval)) {
      await this.computedMetricsRepo.save([
        new ComputedMetrics(date.toISODate(), date.toJSDate()),
      ]);
    }
  }

  async startPriceJobs() {
    const jobs: JobMetadata[] = [calculatePiCycleMetadata];

    await Promise.all([
      jobs.map((job) => this.metricsQueueService.add(job, undefined, { attempts: 1 })),
    ]);
  }
}
