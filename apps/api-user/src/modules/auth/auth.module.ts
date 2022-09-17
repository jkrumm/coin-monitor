import { Module } from '@nestjs/common';
import { AuthService } from '@cm/api-user/modules/auth/services/auth.service';
import { AuthController } from '@cm/api-user/modules/auth/controllers/auth.controller';
import { LocalStrategy } from '@cm/api-user/modules/auth/strategies/local.strategy';
import { JwtStrategy } from '@cm/api-user/modules/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from '@cm/api-user/modules/auth/entities/auth.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forFeature([Auth]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
