import { getEnv } from '@cm/api-common';

export const rmqConfig = () => ({
  RABBIT_MQ_URI: getEnv('RABBIT_MQ_URI') || 'amqp://cm-rabbitmq:5672',
});

export enum rmqServices {
  DATA = 'data',
}
