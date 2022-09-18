import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { rmqTopics } from './rmq.constants';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  topics: rmqTopics[];
}

@Module({
  //providers: [MessagingService],
  //controllers: [MessagingController],
})
export class RmqModule {
  static register({ topics }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          useFactory: (configService: ConfigService) =>
            ({
              exchanges: topics.map((topic) => ({ name: topic, type: 'topic' })),
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
      providers: [RmqService],
      exports: [RabbitMQModule, RmqService],
    };
  }
}
