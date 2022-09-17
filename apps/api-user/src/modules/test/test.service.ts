import { Injectable } from '@nestjs/common';
import { Test } from 'apps/api-user/src/modules/test/test.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepo: EntityRepository<Test>,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testRepo.findAll();
  }

  async createData(text: string): Promise<Test> {
    const testObj = new Test(text);
    await this.testRepo.persist(testObj).flush();
    return testObj;
  }
}
