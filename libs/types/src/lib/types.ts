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
export interface PriceUsd {
  date: string;
  value: string;
}

export interface BaseMetric {
  btc: { date: string; close: number }[];
  events: { date: string; close: number; index: number; type: 'buy' | 'sell' }[];
}
