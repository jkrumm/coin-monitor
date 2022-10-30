import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MetricsEvent,
  MetricsEventType,
} from '@cm/api-data/modules/metrics/entities/metrics-event.entity';

@Injectable()
export class MetricsEventRepo {
  private readonly logger = new Logger(MetricsEventRepo.name);

  constructor(
    @InjectRepository(MetricsEvent)
    private readonly metricsEventRepo: Repository<MetricsEvent>,
  ) {}

  async deleteAndSave(objects: MetricsEvent[]) {
    if (objects.length === 0) {
      return;
    }
    await this.deleteType(objects[0].type);
    await this.metricsEventRepo.save(objects);
  }

  async deleteType(type: MetricsEventType) {
    await this.metricsEventRepo.delete({ type });
  }

  async getByType(type: MetricsEventType) {
    return await this.metricsEventRepo
      .createQueryBuilder('metrics_event')
      .where('metrics_event.type = :type', { type })
      .orderBy('time', 'ASC')
      .getMany();
  }
}
