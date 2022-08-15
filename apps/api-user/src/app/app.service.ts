import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import {DATA_SERVICE} from "apps/api-user/src/constants/services";

@Injectable()
export class AppService {
  constructor(
    @Inject(DATA_SERVICE) private dataClient: ClientProxy
  ) {
  }

  async getData(): Promise<{ message: string }> {
    await lastValueFrom(this.dataClient.emit('get_data', {msg: 'Hello Microservice World!'}));
    return {message: 'Welcome to api-user!'};
  }
}
