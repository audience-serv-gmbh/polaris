import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/user.service';
import { validateHash, generateHash } from '../../../common/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.userRepository.findOne({
      where: {
        email,
        isEnabled: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isCorrectPassword = await validateHash(password, user.password, user.salt);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return user;
  }
}
