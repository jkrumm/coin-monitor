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
import { LogInDto } from '@cm/api-user/modules/auth/dtos/login.dto';
import { AuthDto } from '../dtos/auth.dto';
import JwtAuthenticationGuard from '@cm/api-user/modules/auth/guards/jwt-authentication.guard';
import { RequestWithAuth } from '@cm/types';
import { LocalAuthenticationGuard } from '@cm/api-user/modules/auth/guards/localAuthentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async identity(@Req() request: RequestWithAuth): Promise<AuthDto> {
    const auth = await this.authService.findByAuthId(request.auth.authId);
    return auth.toAuthDto();
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response,
  ): Promise<Response<AuthDto>> {
    const identityDto = await this.authService.register(registerDto);
    const cookie = this.authService.getCookieWithJwtToken(identityDto.authId);
    response.setHeader('Set-Cookie', cookie);
    return response.send(identityDto);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(200)
  async logIn(
    @Body() logInDto: LogInDto,
    @Res() response: Response,
  ): Promise<Response<AuthDto>> {
    // TODO: implement protection against brute force attacks (api gateway)
    const authDto = await this.authService.getAuthenticatedUser(
      logInDto.email,
      logInDto.password,
    );
    const cookie = this.authService.getCookieWithJwtToken(authDto.authId);
    response.setHeader('Set-Cookie', cookie);
    return response.send(authDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('logout')
  async logOut(@Res() response: Response): Promise<Response> {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.send();
  }
}
