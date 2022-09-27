import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@cm/api-user/modules/auth/services/auth.service';
import { RegisterDto } from '@cm/api-user/modules/auth/dtos/register.dto';
import { LoginDto } from '@cm/api-user/modules/auth/dtos/login.dto';
import { AuthDto } from '@cm/api-user/modules/auth/dtos/auth.dto';
import JwtAuthenticationGuard from '@cm/api-user/modules/auth/guards/jwt-authentication.guard';
import { RequestWithUser } from '@cm/types';
import { LocalAuthenticationGuard } from '@cm/api-user/modules/auth/guards/localAuthentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async identity(@Req() { user }: RequestWithUser): Promise<AuthDto> {
    return user;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response,
  ): Promise<Response<AuthDto>> {
    const auth = await this.authService.register(registerDto);
    const cookie = this.authService.getCookie(auth.authId);
    response.setHeader('Set-Cookie', cookie);
    return response.send(auth);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(200)
  async logIn(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response<AuthDto>> {
    // TODO: implement protection against brute force attacks (api gateway)
    const auth = await this.authService.authenticate(loginDto);
    const cookie = this.authService.getCookie(auth.authId);
    response.setHeader('Set-Cookie', cookie);
    // TODO: refactor res.cookie('token', token, { httpOnly: true });
    return response.send(auth);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('logout')
  async logout(@Res() response: Response): Promise<Response> {
    response.setHeader('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
    return response.send();
  }
}
