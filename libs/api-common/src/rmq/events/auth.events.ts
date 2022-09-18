import { IsUUID } from 'class-validator';

export class EventAuthRegistered {
  @IsUUID()
  authId: string;

  constructor(authId: string) {
    this.authId = authId;
  }
}
