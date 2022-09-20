import { getEnv } from '@cm/api-common';

export const mysqlConfig = () => ({
  MYSQL_HOST: getEnv('MYSQL_HOST') || 'cm-mysql',
  MYSQL_PORT: getEnv('MYSQL_PORT') || '3306',
  MYSQL_USER: getEnv('MYSQL_USER') || 'root',
  MYSQL_PASSWORD: getEnv('MYSQL_PASSWORD') || 'toor',
  MYSQL_DB: getEnv('MYSQL_DB') || 'user',
});
