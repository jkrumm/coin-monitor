import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TestService } from './test.service';
import { TestDto } from './dtos/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async getTests(): Promise<TestDto[]> {
    return await this.testService.getTests();
  }

  @Get('/most-likes')
  async getMostLikedTest(): Promise<TestDto> {
    return await this.testService.getMostLikedTest();
  }

  @Post()
  async createTest(@Body() testDto: TestDto) {
    return await this.testService.createTest(testDto);
  }

  @Get('/:id/like')
  async likeTest(@Param('id') id: string): Promise<TestDto> {
    return await this.testService.likeTest(id);
  }
}
