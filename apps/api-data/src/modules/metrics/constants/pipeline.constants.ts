import { IsISO8601, IsString } from 'class-validator';
import { JobMetadata } from '@cm/api-common';

export class StartPipelineJobPayload {
  @IsString()
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}

export const startPipelineJobMetadata: JobMetadata = {
  name: 'start_pipeline',
  payloadType: StartPipelineJobPayload,
};

export const ohlcJobMetadata: JobMetadata = {
  name: 'ohlc',
  payloadType: undefined,
};

export class FetchCoinMetricsJobPayload {
  @IsISO8601()
  date: string;
}

export const fetchCoinMetricsJobMetadata: JobMetadata = {
  name: 'fetch_coin_metrics',
  payloadType: FetchCoinMetricsJobPayload,
};

export const prepareComputedMetricsMetadata: JobMetadata = {
  name: 'prepare_computed_metrics',
};

export const startPriceJobsMetadata: JobMetadata = {
  name: 'start_price_jobs',
};

export const calculatePiCycleMetadata: JobMetadata = {
  name: 'calculate_pi_cycle',
};
