import { Injectable, Logger } from '@nestjs/common';
import { CrossDown, CrossUp, SMA } from '@rylorin/technicalindicators';
import { CmRawMetricsRepo } from '@cm/api-data/modules/metrics/repositories/cm-raw-metrics.repo';
import { ComputedMetricsRepo } from '@cm/api-data/modules/metrics/repositories/computed-metrics.repo';
import { MetricsEventRepo } from '@cm/api-data/modules/metrics/repositories/metrics-event.repo';
import {
  MetricsEvent,
  MetricsEventType,
} from 'apps/api-data/src/modules/metrics/entities/metrics-event.entity';
import { MetricsEventSignal } from '@cm/types';
import { roundArray } from '@cm/api-common';

@Injectable()
export class PricePipelineService {
  private readonly logger = new Logger(PricePipelineService.name);

  constructor(
    private readonly cmRawRepo: CmRawMetricsRepo,
    private readonly computedMetricsRepo: ComputedMetricsRepo,
    private readonly metricsEventRepo: MetricsEventRepo,
  ) {}

  findIndexesInArray(arr: any[], value: any): number[] {
    const indexes = [];
    for (let i = 1; i < arr.length; i++) if (arr[i] === value) indexes.push(i);
    return indexes;
  }

  async calculatePiCycle() {
    const btc = await this.cmRawRepo.getPriceData();
    const events: MetricsEvent[] = [];
    let pyCycleBottomLong, pyCycleBottomShort, pyCycleTopLong, pyCycleTopShort;

    const values = btc.map((item) => item.c);

    // Calculate 350MA * 2
    pyCycleTopLong = SMA.calculate({ period: 350, values }).map((item) => item * 2);

    // Calculate 111MA
    pyCycleTopShort = SMA.calculate({ period: 111, values });

    // Match the length of both results otherwise cross ups don't work
    const matchedPyCycleTopShort = pyCycleTopShort.slice(-pyCycleTopLong.length);

    // Calculate the golden crosses (because it starts with a long at 0 we remove it here)
    const crossesPyCycleTop = CrossUp.calculate({
      lineA: matchedPyCycleTopShort,
      lineB: pyCycleTopLong,
    }).slice(1);

    // Map the resulting signals to events
    const indexesPyCycleTop = this.findIndexesInArray(crossesPyCycleTop, true);
    for (const index of indexesPyCycleTop) {
      // Because the MAs have fewer values than the original data it needs to be corrected
      const value = btc[index + (values.length - pyCycleTopLong.length)];
      events.push(
        new MetricsEvent(
          value.d,
          new Date(value.d),
          MetricsEventType.PY_CYCLE,
          value.c,
          MetricsEventSignal.SELL,
        ),
      );
    }

    // Same for bottom cross but 137MA death crosses 2YMA
    pyCycleBottomLong = SMA.calculate({ period: 365 * 2, values });
    pyCycleBottomShort = SMA.calculate({ period: 137, values });
    const matchedPyCycleBottomShort = pyCycleBottomShort.slice(-pyCycleBottomLong.length);
    const crossesPyCycleBottom = CrossDown.calculate({
      lineA: matchedPyCycleBottomShort,
      lineB: pyCycleBottomLong,
    });
    const indexesPyCycleBottom = this.findIndexesInArray(crossesPyCycleBottom, true);
    for (const index of indexesPyCycleBottom) {
      const value = btc[index + (values.length - pyCycleBottomLong.length)];
      events.push(
        new MetricsEvent(
          value.d,
          new Date(value.d),
          MetricsEventType.PY_CYCLE,
          value.c,
          MetricsEventSignal.BUY,
        ),
      );
    }

    // Reverse and round results to fill the data from latest to oldest into db
    // This will stop all results at the right point
    pyCycleBottomLong = roundArray(pyCycleBottomLong.reverse(), 2);
    pyCycleBottomShort = roundArray(pyCycleBottomShort.reverse(), 2);
    pyCycleTopLong = roundArray(pyCycleTopLong.reverse(), 2);
    pyCycleTopShort = roundArray(pyCycleTopShort.reverse(), 2);

    const metricsEventDescDate = await this.computedMetricsRepo.getDescDates();
    for (const [index, date] of metricsEventDescDate.entries()) {
      await this.computedMetricsRepo.update(date, {
        pyCycleBottomLong: pyCycleBottomLong[index],
        pyCycleBottomShort: pyCycleBottomShort[index],
        pyCycleTopLong: pyCycleTopLong[index],
        pyCycleTopShort: pyCycleTopShort[index],
      });
    }

    // Save events to db
    await this.metricsEventRepo.deleteAndSave(events);
  }
}
