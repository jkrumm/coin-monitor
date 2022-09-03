import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { rmqServices } from '@cm/api-common';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: rmqServices, noAck = false): RmqOptions {
    // TODO: create actual RmqUrl
    const uri: RmqUrl = this.configService.get<string>('RABBIT_MQ_URI') as RmqUrl;
    return {
      transport: Transport.RMQ,
      options: {
        urls: [uri],
        queue,
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext | Record<string, any>) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
