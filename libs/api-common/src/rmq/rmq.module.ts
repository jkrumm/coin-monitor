import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

interface RmqExchange {
  name: string;
  type: string;
}

interface RmqModuleOptions {
  exchanges: RmqExchange[];
}

@Module({
  //providers: [MessagingService],
  //controllers: [MessagingController],
})
export class RmqModule {
  static register({ exchanges }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          useFactory: (configService: ConfigService) =>
            ({
              exchanges,
              uri: configService.get<string>('RABBIT_MQ_URI'),
              connectionInitOptions: { wait: false },
              /* channels: {
                'channel-1': {
                  prefetchCount: 15,
                  default: true,
                },
                'channel-2': {
                  prefetchCount: 2,
                },
              },*/
            } as RabbitMQConfig),
          inject: [ConfigService],
        }),
      ],
      exports: [RabbitMQModule],
    };
  }
}
