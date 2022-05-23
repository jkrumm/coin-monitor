import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

interface DatabaseConfig {
  type: DatabaseType;
  url: string;
  synchronize: boolean;
  entities: any[];
  subscribers: any[];
}

export const dbConfig: TypeOrmModuleOptions = {
  // TODO: Validate configs!
  // validationSchema: Joi.object({
  //   POSTGRES_HOST: Joi.string().required(),
  //   POSTGRES_PORT: Joi.number().required(),
  //   POSTGRES_USER: Joi.string().required(),
  //   POSTGRES_PASSWORD: Joi.string().required(),
  //   POSTGRES_DB: Joi.string().required(),
  //   PORT: Joi.number(),
  // }),
  type: 'mongodb',
  url: `mongodb://root:${process.env.MONGO_ROOT_PASSWORD}@mongo/`,
  synchronize: true,
  autoLoadEntities: true,
  // entities: [__dirname + '../../../../**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  // cli: {
  //   migrationsDir: 'src/database/migrations',
  // },
  // subscribers: [__dirname + '/../../**/*.subscriber.{ts,js}'],
};
