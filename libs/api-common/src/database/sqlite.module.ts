import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class SqliteModule {}
