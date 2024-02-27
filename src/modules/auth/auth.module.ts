import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') }
        }
      }
    }),
    SharedModule,
    PassportModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}