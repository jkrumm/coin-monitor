import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '@cm/api-user/modules/auth/guards/jwt-authentication.guard';
import { RequestWithUser } from '@cm/types';
import { UserService } from '@cm/api-user/modules/user/services/user.service';
import { UserDto } from '@cm/api-user/modules/user/dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async identity(@Req() { user }: RequestWithUser): Promise<UserDto> {
    return await this.userService.getByAuthId(user.authId);
  }
}
