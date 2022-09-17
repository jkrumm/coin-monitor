import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: ['./dist/apps/api-user/**/*.entities.js'],
        entitiesTs: ['./src/apps/api-user/**/*.entities.ts'],
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DB'),
        // autoLoadEntities: true,
        dbName: configService.get('MYSQL_DB'),
        type: 'mysql',
      }),
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('MYSQL_HOST'),
    //     port: configService.get('MYSQL_PORT'),
    //     username: configService.get('MYSQL_USER'),
    //     password: configService.get('MYSQL_PASSWORD'),
    //     database: configService.get('MYSQL_DB'),
    //     entities: [__dirname + '/../**/*.entity.{ts,js}'],
    //     // TODO: implement migrations
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    // }),
  ],
})
export class DatabaseModule {}
