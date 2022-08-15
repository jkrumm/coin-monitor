import { Test } from '@nestjs/testing';
import { ApiCommonService } from './api-common.service';

describe('ApiCommonService', () => {
  let service: ApiCommonService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiCommonService],
    }).compile();

    service = module.get(ApiCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
