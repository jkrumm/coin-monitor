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
import JwtRefreshGuard from '@cm/api-user/modules/auth/guards/jwt-refresh.guard';

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
    const accessTokenCookie = this.authService.getAccessTokenCookie(auth.authId);
    const { refreshTokenCookie, refreshToken } = this.authService.getRefreshTokenCookie(
      auth.authId,
    );
    await this.authService.setCurrentRefreshToken(refreshToken, auth.authId);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return response.send(auth);
  }

  @HttpCode(200)
  // @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response<AuthDto>> {
    // TODO: implement protection against brute force attacks (api gateway)
    const auth = await this.authService.authenticate(loginDto);
    const accessTokenCookie = this.authService.getAccessTokenCookie(auth.authId);
    const { refreshTokenCookie, refreshToken } = this.authService.getRefreshTokenCookie(
      auth.authId,
    );
    await this.authService.setCurrentRefreshToken(refreshToken, auth.authId);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    // TODO: refactor res.cookie('token', token, { httpOnly: true });
    return response.send(auth);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getAccessTokenCookie(request.user.authId);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.res.send(request.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('logout')
  async logout(@Req() request: RequestWithUser): Promise<Response> {
    await this.authService.removeRefreshToken(request.user.authId);
    request.res.setHeader('Set-Cookie', [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]);
    return request.res.send();
  }
}
