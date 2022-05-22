import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DateTest } from '@cm/types';

@Injectable()
export class AppService {
  getData(): DateTest {
    const dateTime = DateTime.now();
    return {
      date: dateTime.toJSDate(),
      isoDate: dateTime.toISODate(),
      milliseconds: dateTime.toMillis(),
    };
  }
}
