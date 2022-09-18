import {
  IsDefined,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  validateOrReject,
  ValidationError,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RequestOptions } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.interfaces';

export enum rmqExchanges {
  AUTH = 'auth',
}

export enum rmqQueues {
  RPC = 'rpc',
  USER = 'user',
  DATA = 'data',
}

export class RmqEventMetadata {
  @IsEnum(rmqExchanges)
  exchange: rmqExchanges;

  @IsString()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/^[a-z]+\.+(event|rpc)+\.+[a-z_]+$/, {
    message: 'routingKey does not match the required pattern ex. auth.event.login',
  })
  routingKey: string;

  @IsDefined()
  payloadType: any;

  constructor(exchange: rmqExchanges, routingKey: string) {
    this.exchange = exchange;
    this.routingKey = routingKey;
  }
}

export class RmqMessage {
  meta: RmqEventMetadata;
  payload: object;

  constructor(meta: RmqEventMetadata, payload: RmqEventMetadata['payloadType']) {
    this.meta = meta;
    this.payload = payload;
  }

  async validate(): Promise<void | ValidationError> {
    await validateOrReject(plainToInstance(RmqEventMetadata, this.meta));
    await validateOrReject(plainToInstance(this.meta.payloadType, this.payload), {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }

  async toEvent(): Promise<any> {
    await this.validate();
    return {
      exchange: this.meta.exchange,
      routingKey: this.meta.routingKey,
      message: this.payload,
    };
  }

  async toRequest(timeout: number = 10000): Promise<RequestOptions> {
    await this.validate();
    return {
      exchange: this.meta.exchange,
      routingKey: this.meta.routingKey,
      payload: this.payload,
      timeout,
    };
  }
}

export class MsgEventPayload {
  @IsString()
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}

export const MsgEventMetadata: RmqEventMetadata = {
  exchange: rmqExchanges.AUTH,
  routingKey: 'auth.event.msg_send',
  payloadType: MsgEventPayload,
};

export class DoRpcPayload {
  @IsString()
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}

export const DoRpcMetadata: RmqEventMetadata = {
  exchange: rmqExchanges.AUTH,
  routingKey: 'auth.rpc.do',
  payloadType: DoRpcPayload,
};
