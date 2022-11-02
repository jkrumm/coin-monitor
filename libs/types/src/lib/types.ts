import { Request } from 'express';

export interface RegisterInterface {
  email: string;
  username: string | null;
  password: string;
}

export interface AuthInterface {
  authId: string;
  username: string | null;
  email: string;
}

export class AuthWithExpiryInterface implements AuthInterface {
  authId: string;
  username: string | null;
  email: string;
  expirationDate: number;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RequestWithUser extends Request {
  user: AuthInterface;
}

export interface TokenPayload {
  authId: string;
}

// METRICS
export interface PriceData {
  d: string;
  c: number;
}

export enum MetricsEventSignal {
  BUY = 'buy',
  SELL = 'sell',
}

export interface MetricsEvent extends PriceData {
  i?: number;
  s: 'buy' | 'sell';
}

export interface TwoMa {
  long: number[];
  short: number[];
}

export interface BaseMetric {
  btc: PriceData[];
  events: MetricsEvent[];
}

export interface PyCycleMetric extends BaseMetric {
  pyCycleBottom: TwoMa;
  pyCycleTop: TwoMa;
}
