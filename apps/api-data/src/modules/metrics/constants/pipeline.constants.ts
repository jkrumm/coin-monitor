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

export class FetchCoinMetricsJobPayload {
  @IsISO8601()
  date: string;
}

export const fetchCoinMetricsJobMetadata: JobMetadata = {
  name: 'fetch_coin_metrics',
  payloadType: FetchCoinMetricsJobPayload,
};
