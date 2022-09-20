import { DateTime } from 'luxon';
import { toDateTime, toIsoDateString } from '@cm/api-common';

describe('toDateTime', () => {
  it('should convert iso string to DateTime', () => {
    const validIsoDateString = '2021-05-21';
    const dateTime = toDateTime(validIsoDateString);

    expect(dateTime).toBeInstanceOf(DateTime);
    expect(dateTime.toISODate()).toEqual(validIsoDateString);
  });

  it('should convert other formats to DateTime with invalid format', () => {
    const invalidIsoString = '1.1.2000';
    const dateTimeIso = toDateTime(invalidIsoString);
    const dateTimeEmpty = toDateTime('');

    expect(dateTimeIso).toBeInstanceOf(DateTime);
    expect(dateTimeEmpty).toBeInstanceOf(DateTime);
    expect(dateTimeIso.isValid).toEqual(false);
    expect(dateTimeEmpty.isValid).toEqual(false);
    expect(dateTimeIso.toISODate()).toEqual(null);
    expect(dateTimeEmpty.toISODate()).toEqual(null);
  });

  it('should create luxon date from Date object', () => {
    expect(toDateTime(new Date())).toBeDefined();
  });
});

describe('toIsoDateString', () => {
  it('should return null if no data was given', () => {
    expect(toIsoDateString('')).toEqual(null);
    expect(toIsoDateString(null)).toEqual(null);
  });

  it('should return iso date if iso format was given', () => {
    const validIsoDateString = '2021-05-21';

    expect(toIsoDateString(`${validIsoDateString}T20:00:00`)).toEqual(validIsoDateString);
  });

  it('should return null if invalid format was given', () => {
    expect(toIsoDateString('')).toEqual(null);
    expect(toIsoDateString(null)).toEqual(null);
    expect(toIsoDateString('foo')).toEqual(null);
    expect(toIsoDateString('1.1.2000')).toEqual(null);
  });
});
