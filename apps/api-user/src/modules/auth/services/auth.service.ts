import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from '@cm/api-user/modules/auth/dtos/register.dto';
import { EmailNotUniqueException } from '@cm/api-user/modules/auth/exceptions/email-not-unique.exception';
import { WrongCredentialsException } from '@cm/api-user/modules/auth/exceptions/wrong-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Auth } from '@cm/api-user/modules/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '@cm/api-user/modules/auth/dtos/login.dto';
import {
  AuthRegisteredEventMetadata,
  AuthRegisteredEventPayload,
  RmqService,
} from '@cm/api-common';
import { AuthInterface, AuthWithExpiryInterface } from '@cm/types';
import { DateTime } from 'luxon';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {}

  /*
   * DATABASE ACCESS
   */

  async findByAuthId(authId: string): Promise<Auth> {
    return this.authRepo.findOneOrFail({ where: { id: authId } });
  }

  async findAuthWithRefreshToken(refreshToken: string, authId: string): Promise<Auth> {
    const auth = await this.findByAuthId(authId);

    const isRefreshTokenValid = await this.verifyRefreshToken(
      auth.refreshToken,
      refreshToken,
    );

    if (isRefreshTokenValid) {
      return auth;
    }
  }

  /*
   * REGISTER
   */

  public async register({
    email,
    username,
    password,
  }: RegisterDto): Promise<AuthInterface> {
    if (await this.authRepo.findOne({ where: { email } })) {
      throw new EmailNotUniqueException();
    }
    const hashedPassword = await this.hashPassword(password);
    let auth = new Auth(email, username, hashedPassword);
    auth = await this.authRepo.save(auth);

    await this.rmqService.sendEvent(
      AuthRegisteredEventMetadata,
      new AuthRegisteredEventPayload(auth.id),
    );

    return auth.toDto();
  }

  /*
   * AUTHENTICATE
   */

  public async authenticate({ email, password }: LoginDto): Promise<AuthInterface> {
    try {
      const auth = await this.authRepo.findOneOrFail({ where: { email } });
      await this.verifyPassword(auth.password, password);
      return auth.toDto();
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  public getAccessTokenCookie(auth: AuthInterface) {
    // TODO: increase Cookie and JWT security
    // https://stormpath.com/blog/build-secure-user-interfaces-using-jwts
    // https://stormpath.com/blog/token-auth-spa
    const jwtAccessTokenExpirationTime = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );
    const token = this.jwtService.sign(
      { authId: auth.authId },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${jwtAccessTokenExpirationTime}s`,
      },
    );
    const accessTokenCookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtAccessTokenExpirationTime}`;
    const authWithExpiry: AuthWithExpiryInterface = {
      ...auth,
      expirationDate: DateTime.now()
        .plus({ seconds: jwtAccessTokenExpirationTime })
        .toSeconds(),
    };
    return {
      accessTokenCookie,
      authWithExpiry,
    };
  }

  /*
   * REFRESH TOKEN
   */

  public getRefreshTokenCookie(authId: string): {
    refreshTokenCookie: string;
    refreshToken: string;
  } {
    const refreshToken = this.jwtService.sign(
      { authId },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
      },
    );
    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      refreshTokenCookie,
      refreshToken,
    };
  }

  async setCurrentRefreshToken(refreshToken: string, authId: string): Promise<void> {
    refreshToken = await argon2.hash(refreshToken, {
      type: argon2.argon2i,
      parallelism: 1,
      memoryCost: 64000, // 64 mb
      timeCost: 3, // number of iterations
      salt: crypto.randomBytes(16),
      secret: Buffer.from(
        this.configService.get<string>('JWT_REFRESH_TOKEN_HASH_PEPPER'),
        'utf8',
      ),
    });
    await this.authRepo.update(authId, {
      refreshToken,
    });
  }

  async removeRefreshToken(authId: string): Promise<void> {
    await this.authRepo.update(authId, {
      refreshToken: null,
    });
  }

  /*
   * HASHING
   */

  private async hashPassword(password: string): Promise<string> {
    try {
      // based on OWASP cheat sheet recommendation's (as of March, 2022)
      return await argon2.hash(password, {
        type: argon2.argon2i,
        parallelism: 1,
        memoryCost: 64000, // 64 mb
        timeCost: 3, // number of iterations
        salt: crypto.randomBytes(16),
        secret: Buffer.from(this.configService.get<string>('PW_HASH_PEPPER'), 'utf8'),
      });
    } catch (e) {
      throw new HttpException('Hashing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async verifyPassword(
    hashedPassword: string,
    plaintextPassword: string,
  ): Promise<boolean> {
    try {
      if (
        await argon2.verify(hashedPassword, plaintextPassword, {
          secret: Buffer.from(this.configService.get<string>('PW_HASH_PEPPER'), 'utf8'),
        })
      ) {
        return true;
      } else {
        throw new WrongCredentialsException();
      }
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  private async verifyRefreshToken(
    hashedRefreshToken: string,
    plaintextRefreshToken: string,
  ): Promise<boolean> {
    try {
      if (
        await argon2.verify(hashedRefreshToken, plaintextRefreshToken, {
          secret: Buffer.from(
            this.configService.get<string>('JWT_REFRESH_TOKEN_HASH_PEPPER'),
            'utf8',
          ),
        })
      ) {
        return true;
      } else {
        throw new BadRequestException('Invalid refresh token');
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
