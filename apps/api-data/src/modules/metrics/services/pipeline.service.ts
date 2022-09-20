import { get, toIsoDateString } from '@cm/api-common';
import { Injectable, Logger } from '@nestjs/common';
import {
  fetchCoinMetricsJobMetadata,
  MetricsQueueService,
} from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import {
  AvailableMetricsResponse,
  CoinMetricsRawResponse,
  CoinMetricsRawResponseWithDate,
  requiredMetrics,
} from '@cm/api-data/modules/metrics/metrics.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { DateTime } from 'luxon';

class PipelineStatus {
  date: string | null = null;
}

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);
  pipelineStatus: PipelineStatus = new PipelineStatus();

  constructor(
    private readonly metricsQueueService: MetricsQueueService,
    @InjectRepository(CoinMetricsRaw)
    private readonly coinMetricsRawRepo: Repository<CoinMetricsRaw>,
  ) {}

  // TODO: schedule at 1am
  async startPipeline() {
    const todayDate = DateTime.now().minus({ day: 1 }).toISODate();
    if (this.pipelineStatus.date === null || this.pipelineStatus.date !== todayDate) {
      this.logger.log('initialized pipeline');
      this.pipelineStatus.date = todayDate;
    }
    if ((await areMetricsAvailable()) === true) {
      this.logger.log('metrics available');
      await this.metricsQueueService.add(
        fetchCoinMetricsJobMetadata,
        { date: todayDate },
        { attempts: 1 },
      );
      this.logger.log('pipeline started');
      return;
    }
    this.logger.log('metrics unavailable');
    /*await this.metricsQueueService.add(
      startPipelineJobMetadata,
      { msg: 'Hello World!' },
      {
        delay: 5 * 60 * 1000,
      },
    );*/
  }

  async fetchCoinMetrics(date: string) {
    const mostRecentDb = await this.coinMetricsRawRepo
      .createQueryBuilder('coin_metrics_raw')
      .orderBy('time', 'DESC')
      .getOne();

    const mostRecentDate = mostRecentDb !== null ? mostRecentDb.date : '2010-01-01';

    console.log('date ' + date);
    console.log('mostRecentDate ' + mostRecentDate);

    if (toIsoDateString(date) === toIsoDateString(mostRecentDate)) {
      this.logger.log('already done this date', {
        jobDate: date,
        mostRecentDate,
      });
      return;
    }

    const rawResponse: CoinMetricsRawResponse[] = plainToInstance(
      CoinMetricsRawResponse,
      (
        await get<{ data: object[] }>(
          `https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=${requiredMetrics.toString()}&frequency=1d&page_size=10000&start_time=${mostRecentDate}`,
        )
      ).data,
      { excludeExtraneousValues: true },
    );

    const rawResponseWithDate: CoinMetricsRawResponseWithDate[] = rawResponse.map(
      (v) => ({ ...v, date: toIsoDateString(v.time) }),
    );

    rawResponseWithDate.map(async (v) => await validateOrReject(v));

    console.log(rawResponse.length);
    console.log(rawResponse[0]);
    console.log(rawResponseWithDate[0]);

    await this.coinMetricsRawRepo.save(rawResponseWithDate);
  }
}

const areMetricsAvailable = async (): Promise<boolean> => {
  const response = (
    await get<AvailableMetricsResponse[]>(
      'https://availability.coinmetrics.io/public-api/availability',
    )
  ).filter(({ asset }) => asset === 'BTC')[0];

  console.log('response.updatedTime ' + response.updatedTime);

  return (
    toIsoDateString(response.updatedTime) === toIsoDateString(new Date()) &&
    requiredMetrics.every((v) => response.availableMetrics.includes(v))
  );
};
