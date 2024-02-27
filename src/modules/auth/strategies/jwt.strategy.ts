import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../../entities/user.entity';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(args: { userId: string }): Promise<UserEntity> {
    const user = await this.userService.userRepository.findOne({
      where: {
        id: args.userId,
      },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}