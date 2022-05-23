import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestEntity } from './test.entity';
import { TestDto } from './dtos/test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: MongoRepository<TestEntity>
  ) {}

  async getTests(): Promise<TestDto[]> {
    const tests = await this.testRepo.find();
    const testDtos: TestDto[] = [];
    for (const test of tests) {
      testDtos.push(test.toTestDto());
    }
    return testDtos;
  }

  async getMostLikedTest() {
    const test = await this.testRepo.findOne({
      order: {
        likes: 'DESC',
      },
    });
    return test.toTestDto();
  }

  async createTest(testDto: TestDto): Promise<TestDto> {
    let test = new TestEntity(testDto.message, testDto.likes);
    test = await this.testRepo.save(test);
    return test.toTestDto();
  }

  async likeTest(id: string): Promise<TestDto> {
    let test = await this.testRepo.findOne(id);

    if (!test) {
      throw new NotFoundException(`Test entity not found ${id}`);
    }

    test.like();

    await this.testRepo.save(test);

    return test.toTestDto();
  }
}
