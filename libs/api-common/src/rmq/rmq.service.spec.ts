import { Test } from '@nestjs/testing';
import { RmqService } from '@cm/api-common';

describe('RmqService', () => {
  let service: RmqService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RmqService],
    }).compile();

    service = module.get(RmqService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
