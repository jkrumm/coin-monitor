import { DateTime, Interval } from 'luxon';

/**
 * Wrapper function to reduce verbosity
 *
 * Converts different iso strings into luxon objects
 */
export function toDateTime(date: string | Date): DateTime {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date);
  }
  // in case we have invalid date, DateTime will softfail by returning a valid
  // Object with invalid data (which results in formmating functions to return null)
  return DateTime.fromISO(date);
}

/**
 * Wrapper function to reduce verbosity
 *
 * Converts iso string or js data into
 * to an ISODate (e.g. "2021-2-25") string
 * or null if invalid/no data was given
 */
export function toIsoDateString(date: string | Date | null): string | null {
  if (!date) {
    return null;
  }

  return toDateTime(date).toISODate();
}

export function todayDateTime(): DateTime {
  return DateTime.now().startOf('day');
}

// Loop over days
export function* days(interval: Interval) {
  let cursor = interval.start.startOf('day');
  while (cursor < interval.end) {
    yield cursor;
    cursor = cursor.plus({ days: 1 });
  }
}
