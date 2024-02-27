import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../../entities/user.entity';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) {}

  async getAccessToken(user: UserEntity) {
    const payload = { userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });

    return {
      token: accessToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const HASH_ROUND = this.configService.numberHashRound;
    const userResult = await this.userService.findUserById(dto.userId);

    if (!userResult) throw new BadRequestException('User does not exist');

    const hashedToken = userResult[0].resetToken;
    const isValidToken = await bcrypt.compare(dto.token, hashedToken);

    if (!isValidToken) throw new BadRequestException('Invalid reset token');

    const newHashedPassword = await bcrypt.hash(dto.newPassword, HASH_ROUND);
    const newPassword = new UpdatePasswordDto();
    newPassword.userId = dto.userId;
    newPassword.password = newHashedPassword;

    return this.userService.updatePassword(newPassword);
  }
}
