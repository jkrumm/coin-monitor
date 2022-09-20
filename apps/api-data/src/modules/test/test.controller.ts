import { Controller, Get, Param, Post } from '@nestjs/common';
import { TestService } from '@cm/api-data/modules/test/test.service';
import { Test } from '@cm/api-data/modules/test/test.entity';

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
