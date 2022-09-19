import {
  IsDefined,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  validateOrReject,
  ValidationError,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BullModuleOptions } from '@nestjs/bull';
import { JobOptions } from 'bull';
import { booly } from 'libs/api-common/src/utils/booly';
import { getEnv } from 'libs/api-common/src/utils/get-env';

const queue = 'coin-monitor';

interface QueueOptions extends BullModuleOptions {
  name: string;
}

export interface IQueueConfigs {
  [name: string]: QueueOptions;
}

export const queues: IQueueConfigs = {
  metrics: {
    name: queue + ':metrics',
  },
};

export const taskConfig: JobOptions = {
  removeOnComplete: booly(getEnv('QUEUE_REMOVE_COMPLETED') || 'true'),
  removeOnFail: false,
  delay: undefined,
  // retries after 1, 3, 9, 27 seconds
  attempts: 4,
  backoff: {
    type: 'exponential',
    delay: 3000,
  },
};

export class JobMetadata {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'taskName does not match the required pattern ex. test_task',
  })
  name: string;

  @IsDefined()
  payloadType: any;

  constructor(taskName: string, payloadType: any) {
    this.name = taskName;
    this.payloadType = payloadType;
  }
}

export class QueueJob {
  meta: JobMetadata;
  payload: object;

  constructor(meta: JobMetadata, payload: JobMetadata['payloadType']) {
    this.meta = meta;
    this.payload = payload;
  }

  async validate(): Promise<void | ValidationError> {
    await validateOrReject(plainToInstance(JobMetadata, this.meta));
    await validateOrReject(plainToInstance(this.meta.payloadType, this.payload), {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }
}
