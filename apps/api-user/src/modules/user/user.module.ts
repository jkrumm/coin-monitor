import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@cm/api-user/modules/user/entites/user.entity';
import { UserController } from '@cm/api-user/modules/user/controllers/user.controller';
import { UserService } from '@cm/api-user/modules/user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
