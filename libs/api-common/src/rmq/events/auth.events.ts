import { RmqEventMetadata, rmqExchanges } from 'libs/api-common/src/rmq/rmq.constants';
import { IsUUID } from 'class-validator';

export class AuthRegisteredEventPayload {
  @IsUUID()
  authId: string;

  constructor(authId: string) {
    this.authId = authId;
  }
}

export const AuthRegisteredEventMetadata: RmqEventMetadata = {
  exchange: rmqExchanges.AUTH,
  routingKey: 'auth.event.registered',
  payloadType: AuthRegisteredEventPayload,
};
