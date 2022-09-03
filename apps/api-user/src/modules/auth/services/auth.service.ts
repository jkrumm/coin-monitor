import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findByAuthId(authId: string) {
    return await this.authRepo.findOne({ where: { id: authId } });
  }

  async create(registerDto: RegisterDto): Promise<AuthDto> {
    if (await this.authRepo.findOne({ where: { email: registerDto.email } })) {
      throw new EmailNotUniqueException(registerDto.email);
    } else {
      let auth = new Auth(registerDto.email, registerDto.username, registerDto.password);
      await this.authRepo.save(auth);
      // await this.profileService.create(user.authId);
      return auth.toAuthDto();
    }
  }

  public async register(registerDto: RegisterDto): Promise<AuthDto> {
    try {
      const newIdentity: RegisterDto = {
        email: registerDto.email,
        username: registerDto.username,
        password: await this.hashPassword(registerDto.password),
      };
      return this.create(newIdentity);
    } catch (error) {
      if (error instanceof EmailNotUniqueException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  public async getAuthenticatedUser(
    email: string,
    plaintextPassword: string,
  ): Promise<AuthDto> {
    try {
      const auth = await this.authRepo.findOne({ where: { email } });
      await this.verifyPassword(auth.password, plaintextPassword);
      return auth.toAuthDto();
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  public getCookieWithJwtToken(authId: string) {
    // TODO: increase Cookie and JWT security
    // https://stormpath.com/blog/build-secure-user-interfaces-using-jwts
    // https://stormpath.com/blog/token-auth-spa
    const token = this.jwtService.sign({ authId });
    const jwtExpirationTime = this.configService.get<string>('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExpirationTime}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
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
