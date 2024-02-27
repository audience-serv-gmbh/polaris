import { Module } from '@nestjs/common';
import { SharedModule } from "./shared/shared.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "./shared/services/config.service";
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
