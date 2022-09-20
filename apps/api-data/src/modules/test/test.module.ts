import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@cm/api-data/modules/test/test.entity';
import { TestController } from '@cm/api-data/modules/test/test.controller';
import { TestService } from '@cm/api-data/modules/test/test.service';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
