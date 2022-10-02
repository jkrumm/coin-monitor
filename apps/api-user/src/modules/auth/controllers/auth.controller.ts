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
import JwtAuthenticationGuard from '@cm/api-user/modules/auth/guards/jwt-authentication.guard';
import { AuthInterface, AuthWithExpiryInterface, RequestWithUser } from '@cm/types';
import JwtRefreshGuard from '@cm/api-user/modules/auth/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async identity(@Req() { user }: RequestWithUser): Promise<AuthInterface> {
    return user;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response,
  ): Promise<Response<AuthWithExpiryInterface>> {
    const auth = await this.authService.register(registerDto);
    const { accessTokenCookie, authWithExpiry } =
      this.authService.getAccessTokenCookie(auth);
    const { refreshTokenCookie, refreshToken } = this.authService.getRefreshTokenCookie(
      auth.authId,
    );
    await this.authService.setCurrentRefreshToken(refreshToken, auth.authId);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return response.send(authWithExpiry);
  }

  @HttpCode(200)
  // @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response<AuthWithExpiryInterface>> {
    // TODO: implement protection against brute force attacks (api gateway)
    const auth = await this.authService.authenticate(loginDto);
    const { accessTokenCookie, authWithExpiry } =
      this.authService.getAccessTokenCookie(auth);
    const { refreshTokenCookie, refreshToken } = this.authService.getRefreshTokenCookie(
      auth.authId,
    );
    await this.authService.setCurrentRefreshToken(refreshToken, auth.authId);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    // TODO: refactor res.cookie('token', token, { httpOnly: true });
    return response.send(authWithExpiry);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser): AuthWithExpiryInterface {
    const { accessTokenCookie, authWithExpiry } = this.authService.getAccessTokenCookie(
      request.user,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return authWithExpiry;
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
