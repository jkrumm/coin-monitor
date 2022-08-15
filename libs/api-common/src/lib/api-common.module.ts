import { Module } from '@nestjs/common';
import { ApiCommonService } from './api-common.service';

@Module({
  controllers: [],
  providers: [ApiCommonService],
  exports: [ApiCommonService],
})
export class ApiCommonModule {}
