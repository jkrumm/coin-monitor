import { IsEnum, IsUUID, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export const cmd = {
  analytics: 'cmd.analytics',
  user: {
    create: 'cmd.user.create',
  },
};

export enum AnalyticsSources {
  AUTH = 'auth',
}

export enum AnalyticsTypes {
  AUTH_LOGIN = 'login',
  AUTH_REGISTER = 'register',
}

export class CmdAnalytics {
  @IsEnum(AnalyticsSources)
  readonly source: AnalyticsSources;

  @IsEnum(AnalyticsTypes)
  readonly type: AnalyticsTypes;

  readonly timestamp: Date = new Date();

  constructor(source: AnalyticsSources, type: AnalyticsTypes) {
    this.source = source;
    this.type = type;
  }
}

export class CmdUserCreate {
  @IsUUID()
  authId: string;

  constructor(authId: string) {
    this.authId = authId;
  }
}

export const eventMap = new Map<string, any>([
  [cmd.analytics, CmdAnalytics],
  [cmd.user.create, CmdUserCreate],
]);

export async function rmqSend(
  client: ClientProxy,
  cmd: string,
  payload: object,
): Promise<any> {
  await validate(cmd, payload);
  return await lastValueFrom(client.send(cmd, payload));
}

export async function rmqEmit(
  client: ClientProxy,
  cmd: string,
  payload: object,
): Promise<void> {
  await validate(cmd, payload);
  return await lastValueFrom(client.emit(cmd, payload));
}

async function validate(cmd: string, payload: object) {
  if (!eventMap.has(cmd)) {
    throw new Error('unknown event pattern');
  }
  await validateOrReject(plainToClass(eventMap.get(cmd), payload));
}
