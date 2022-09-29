import { Module } from '@nestjs/common';
import { AuthService } from '@cm/api-user/modules/auth/services/auth.service';
import { AuthController } from '@cm/api-user/modules/auth/controllers/auth.controller';
import { JwtStrategy } from '@cm/api-user/modules/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from '@cm/api-user/modules/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rmqExchanges, RmqModule } from '@cm/api-common';
import { JwtRefreshTokenStrategy } from '@cm/api-user/modules/auth/strategies/jwt-refresh-token.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    RmqModule.register({
      exchanges: [rmqExchanges.AUTH],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
