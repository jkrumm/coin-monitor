import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { rmqQueues, RmqService } from '@cm/api-common';

interface RmqModuleOptions {
  queue: rmqQueues;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(
    { queue }: RmqModuleOptions = { queue: rmqQueues.DEFAULT },
  ): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: queue,
            useFactory: (configService: ConfigService) =>
              ({
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>('RABBIT_MQ_URI')],
                  queue,
                },
              } as ClientOptions),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
