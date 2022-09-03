import { getEnv } from '@cm/api-common';

export const authConfig = () => ({
  JWT_SECRET: getEnv('JWT_SECRET') || 'JWT_SECRET',
  JWT_EXPIRATION_TIME: getEnv('JWT_EXPIRATION_TIME') || '3600',
  PW_HASH_PEPPER: getEnv('PW_HASH_PEPPER') || 'PW_HASH_PEPPER',
});
