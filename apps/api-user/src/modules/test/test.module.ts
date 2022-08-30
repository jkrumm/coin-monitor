import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestService } from 'apps/api-user/src/modules/test/test.service';
import { Test } from 'apps/api-user/src/modules/test/test.entity';
import { TestController } from 'apps/api-user/src/modules/test/test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
