import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { rmqServices } from '@cm/api-common';

@Injectable()
export class AppService {
  constructor(@Inject(rmqServices.DATA) private dataClient: ClientProxy) {}

  async getData(): Promise<{ message: string }> {
    await lastValueFrom(
      this.dataClient.emit('get_data', { msg: 'Hello Microservice World!' }),
    );
    return { message: 'Welcome to api-user!' };
  }
}
