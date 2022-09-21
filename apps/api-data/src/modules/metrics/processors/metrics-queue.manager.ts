import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, JobOptions, Queue } from 'bull';
import {
  AbstractQueueManager,
  jobConfig,
  JobMetadata,
  QueueJob,
  queues,
} from '@cm/api-common';

@Injectable()
export class MetricsQueueService {
  private readonly logger = new Logger(MetricsQueueService.name);

  constructor(
    @InjectQueue(queues.metrics.name)
    private readonly queue: Queue,
  ) {}

  async add<T>(
    metadata: JobMetadata,
    payload: object,
    options?: JobOptions,
  ): Promise<Job<T>> {
    const job = new QueueJob(metadata, payload);
    try {
      await job.validate();
      return await this.queue.add(job.meta.name, job.payload, {
        ...jobConfig,
        ...(options ? options : {}),
      });
    } catch (e) {
      this.logger.error('add job to queue failed', {
        error: JSON.stringify(e),
        jobName: metadata.name,
        payload: JSON.stringify(payload),
      });
      throw e;
    }
  }
}

@Processor(queues.metrics.name)
/* istanbul ignore next */
export class MetricsQueueManager extends AbstractQueueManager {
  protected readonly logger = new Logger(MetricsQueueManager.name);

  /**
   * When using named jobs, bull will stack the amount of concurrent workers per queue,
   * leading to additional workers for each @process decorator (https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueprocess)
   * To avoid this, we have a dummy processor to define the amount of concurrent workers while setting concurrency to 0 on all named jobs
   */
  @Process({
    name: 'concurrency',
    concurrency: 3,
  })
  async handleConcurrency() {
    this.logger.error(
      `${queues.metrics.name} - this processor is only to define the concurrency and does not actually handle messages`,
    );
  }
}
