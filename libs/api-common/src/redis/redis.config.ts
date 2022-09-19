import { getEnv } from '@cm/api-common';

export const redisConfig = () => ({
  REDIS_HOST: getEnv('REDIS_HOST') || 'localhost',
  REDIS_PORT: Number(getEnv('REDIS_PORT') || '6379'),
});
