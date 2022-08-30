import { Controller, Get, Param, Post } from '@nestjs/common';
import { Test } from 'apps/api-user/src/modules/test/test.entity';
import { TestService } from 'apps/api-user/src/modules/test/test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  async getData(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Post('/:text')
  async createData(@Param('text') text: string): Promise<Test> {
    return this.testService.createData(text);
  }
}
