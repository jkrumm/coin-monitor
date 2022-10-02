import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@cm/api-user/modules/auth/services/auth.service';
import { LoginDto } from '@cm/api-user/modules/auth/dtos/login.dto';
import { AuthInterface } from '@cm/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<AuthInterface> {
    const loginDto: LoginDto = { email, password };
    return this.authService.authenticate(loginDto);
  }
}
