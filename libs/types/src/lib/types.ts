import { Request } from 'express';

export interface RegisterInterface {
  email: string;
  username: string;
  password: string;
}

export interface AuthInterface {
  authId: string;
  username: string;
  email: string;
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
