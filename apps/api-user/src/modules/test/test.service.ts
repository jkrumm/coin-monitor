import { Injectable } from '@nestjs/common';
import { Test } from 'apps/api-user/src/modules/test/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testRepository.find();
  }

  async createData(text: string): Promise<Test> {
    const testObj = new Test(text);
    await this.testRepository.save(testObj);
    return testObj;
  }
}
