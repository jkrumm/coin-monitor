import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { EventAuthRegistered } from './events/auth.events';

export enum rmqTopics {
  AUTH = 'auth',
}

export enum rmqEvents {
  AUTH_REGISTERED = 'auth.event.registered',
  AUTH_RPC_DO = 'auth.rpc.do',
  AUTH_MSG = 'auth.msg',
}

export enum rmqQueues {
  RPC = 'rpc',
  USER = 'user',
  DATA = 'data',
}

export interface RmqEvent {
  exchange: string;
  routingKey: string;
  message: any;
}

export class EventMsgEvent {
  @IsString()
  @Expose()
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}

export class RpcDo {
  @IsString()
  @Expose()
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}

export const eventMap = new Map<string, any>([
  [EventMsgEvent.name, [EventMsgEvent, rmqEvents.AUTH_MSG]],
  [EventAuthRegistered.name, [EventAuthRegistered, rmqEvents.AUTH_REGISTERED]],
  [RpcDo.name, [RpcDo, rmqEvents.AUTH_RPC_DO]],
]);
