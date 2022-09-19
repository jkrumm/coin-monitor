import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from '@cm/api-user/modules/auth/dtos/register.dto';
import { AuthDto } from '@cm/api-user/modules/auth/dtos/auth.dto';
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
  RmqMessage,
  RmqService,
} from '@cm/api-common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {}

  async findByAuthId(authId: string): Promise<Auth> {
    return this.authRepo.findOneOrFail({ where: { id: authId } });
  }

  public async register({ email, username, password }: RegisterDto): Promise<AuthDto> {
    if (await this.authRepo.findOne({ where: { email } })) {
      throw new EmailNotUniqueException();
    }
    const hashedPassword = await this.hashPassword(password);
    let auth = new Auth(email, username, hashedPassword);
    auth = await this.authRepo.save(auth);

    await this.rmqService.sendEvent(
      new RmqMessage(
        AuthRegisteredEventMetadata,
        new AuthRegisteredEventPayload(auth.id),
      ),
    );

    return auth.toDto();
  }

  public async authenticate({ email, password }: LoginDto): Promise<AuthDto> {
    try {
      const auth = await this.authRepo.findOneOrFail({ where: { email } });
      await this.verifyPassword(auth.password, password);
      return auth.toDto();
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  public getCookie(authId: string) {
    // TODO: increase Cookie and JWT security
    // https://stormpath.com/blog/build-secure-user-interfaces-using-jwts
    // https://stormpath.com/blog/token-auth-spa
    const token = this.jwtService.sign({ authId });
    const jwtExpirationTime = this.configService.get<string>('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExpirationTime}`;
  }

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
}
