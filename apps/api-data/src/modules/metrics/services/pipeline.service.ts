import { toIsoDateString } from '@cm/api-common';
import { Injectable, Logger } from '@nestjs/common';
import { MetricsQueueService } from '@cm/api-data/modules/metrics/processors/metrics-queue.manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinMetricsRaw } from '@cm/api-data/modules/metrics/entities/coin-metrics-raw.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { fetchCoinMetricsJobMetadata } from '@cm/api-data/modules/metrics/constants/pipeline.constants';
import { queueDataJobGroup } from '@cm/api-data/constants/api-data.constants';
import { PipelineUtilService } from '@cm/api-data/modules/metrics/util/pipeline-util.service';

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
    private readonly pipelineServiceUtil: PipelineUtilService,
    @InjectRepository(CoinMetricsRaw)
    private readonly coinMetricsRawRepo: Repository<CoinMetricsRaw>,
  ) {}

  // TODO: schedule at 1am
  async startPipeline() {
    const date = DateTime.now().minus({ day: 1 }).toISODate();
    if ((await this.pipelineServiceUtil.areMetricsAvailable()) === true) {
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
    /*await this.metricsQueueService.add(
      startPipelineJobMetadata,
      { msg: 'Hello World!' },
      {
        delay: 5 * 60 * 1000,
      },
    );*/
  }

  async fetchCoinMetrics(date: string) {
    const mostRecentDate = await this.pipelineServiceUtil.getMostRecentDatePipelineRaw();

    if (toIsoDateString(date) === toIsoDateString(mostRecentDate)) {
      this.logger.log('fetchCoinMetrics - already done this date', {
        jobDate: date,
        mostRecentDate,
        jobGroup,
      });
      return;
    }

    const rawResponse = await this.pipelineServiceUtil.getCoinMetricsRawResponse(
      mostRecentDate,
    );

    this.logger.log('fetchCoinMetrics - new entries', {
      amountOfNewEntries: rawResponse.length - 1,
      jobDate: date,
      mostRecentDate,
      jobGroup,
    });

    await this.coinMetricsRawRepo.save(rawResponse);
  }
}
