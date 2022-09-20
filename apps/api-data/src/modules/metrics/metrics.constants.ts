import { IsDefined, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export const requiredMetrics = [
  'PriceUSD',
  'CapRealUSD',
  'CapMrktCurUSD',
  'CapMVRVCur',
  'NVTAdjFF',
  'IssTotUSD',
];

export class CoinMetricsRawResponse {
  @IsDefined()
  @Expose()
  @Transform(({ value }) => new Date(String(value)))
  time: Date;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  PriceUSD: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  @Transform(({ value }) => (String(value) === '0' ? null : value))
  CapRealUSD: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  CapMrktCurUSD: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  CapMVRVCur: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  NVTAdjFF: string | null = null;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  IssTotUSD: string | null = null;
}

export class CoinMetricsRawResponseWithDate extends CoinMetricsRawResponse {
  @IsString()
  @IsNotEmpty()
  @Expose()
  date: string;
}

export interface AvailableMetricsResponse {
  asset: string;
  updatedTime: string;
  availableMetrics: string[];
}
