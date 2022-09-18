import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  AuthRegisteredEventMetadata,
  AuthRegisteredEventPayload,
  rmqQueues,
} from '@cm/api-common';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @RabbitSubscribe({
    ...AuthRegisteredEventMetadata,
    queue: rmqQueues.USER,
  })
  @UsePipes(ValidationPipe)
  public async pubSubHandler(@RabbitPayload() { authId }: AuthRegisteredEventPayload) {
    this.logger.log(`Received registration: ${authId}`);
    const user = new User(authId);
    await this.userRepo.save(user);
  }

  async getByAuthId(authId: string): Promise<UserDto> {
    const user = await this.userRepo.findOneOrFail({ where: { authId } });
    return user.toDto();
  }
}
