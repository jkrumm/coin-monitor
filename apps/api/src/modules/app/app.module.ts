import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TestModule } from "../test/test.module";
import { dbConfig } from "../../config";

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
