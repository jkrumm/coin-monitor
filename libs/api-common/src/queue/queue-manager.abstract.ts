import { Logger } from '@nestjs/common';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
} from '@nestjs/bull';
import { Job } from 'bull';

export const queueStatus = {
  STARTED: 'STARTED',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  STALLED: 'STALLED',
};

export abstract class AbstractQueueManager {
  protected readonly logger = new Logger(AbstractQueueManager.name);

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.log(
      {
        status: queueStatus.STARTED,
        job: job.id,
        name: job.name,
      },
      'Job execution started',
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job): void {
    this.logger.log(
      {
        status: queueStatus.SUCCESS,
        job: job.id,
        name: job.name,
      },
      'Job execution completed',
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, e: Error): void {
    const isLastAttempt = job.opts.attempts && job.attemptsMade >= job.opts.attempts;

    if (isLastAttempt) {
      // Sentry.captureException(e);
      this.logger.error(`Job execution finally failed`, {
        status: queueStatus.FAILED,
        job: job.id,
        name: job.name,
        attemptsMade: job.attemptsMade,
        attempts: job.opts.attempts,
        error: {
          message: e.message,
          name: e.name,
        },
      });
    } else {
      this.logger.warn(`Job execution attempt failed`, {
        status: queueStatus.ERROR,
        job: job.id,
        name: job.name,
        attemptsMade: job.attemptsMade,
        attempts: job.opts.attempts,
        error: {
          message: e.message,
          name: e.name,
        },
      });
    }
  }

  @OnQueueError()
  onError(job: Job, e: Error): void {
    this.logger.error('Unhandled Error on job execution', {
      status: queueStatus.ERROR,
      job: job.id,
      name: job.name,
      attemptsMade: job.attemptsMade,
      attempts: job.opts.attempts,
      error: {
        message: e.message,
        name: e.name,
      },
    });

    /* Sentry.captureException(e, {
      extra: {
        origin: 'OnQueueError handler',
      },
    }); */
  }

  @OnQueueStalled()
  onStalled(job: Job): void {
    this.logger.error('Queue stalled while processing job', {
      status: queueStatus.STALLED,
      job: job.id,
      name: job.name,
      attemptsMade: job.attemptsMade,
      attempts: job.opts.attempts,
    });
  }
}
