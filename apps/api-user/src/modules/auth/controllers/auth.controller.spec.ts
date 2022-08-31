import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'apps/api-user/src/modules/auth/controllers/auth.controller';
import { AuthService } from 'apps/api-user/src/modules/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
