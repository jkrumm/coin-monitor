import { Module } from '@nestjs/common';
import { TestService } from 'apps/api-user/src/modules/test/test.service';
import { Test } from 'apps/api-user/src/modules/test/test.entity';
import { TestController } from 'apps/api-user/src/modules/test/test.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
