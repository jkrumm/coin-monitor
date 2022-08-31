import { Module } from '@nestjs/common';
import { AuthService } from '@cm/api-user/modules/auth/services/auth.service';
import { AuthController } from '@cm/api-user/modules/auth/controllers/auth.controller';
import { LocalStrategy } from '@cm/api-user/modules/auth/strategies/local.strategy';
import { JwtStrategy } from '@cm/api-user/modules/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from '@cm/api-user/modules/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secure',
        signOptions: {
          expiresIn: `3600s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
