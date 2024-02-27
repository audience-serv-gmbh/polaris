import * as bcrypt from 'bcrypt';
import * as shortid from 'shortid';
import * as crypto from 'crypto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { AclService } from '../acl/acl.service';
import { MailService } from '../../shared/services/mail.service';
import { ConfigService } from '../../shared/services/config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SendMailDto } from '../../common/dto/send-mail.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    private aclService: AclService,
    private configService: ConfigService,
  ) {}

  findUsers(query) {
    const take = query.limit ? parseInt(query.limit) : 20;
    const skip = query.page ? (parseInt(query.page) - 1) * take : 0;
    const where: FindOptionsWhere<UserEntity> = {};

    if (query.keyword) {
      where.firstName = Like(`${query.keyword}%`);
    }

    return this.userRepository.find({
      where,
      take,
      skip,
      order: {
        firstName: 'ASC',
      },
    });
  }

  findUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  @Transactional()
  async createUser(user: CreateUserDto) {
    const existedUser = await this.userRepository.find({
      where: { email: user.email },
    });

    if (existedUser.length) {
      throw new BadRequestException('User already existed');
    }
    const salt = await bcrypt.genSalt(); 
    const newUser = new UserEntity();
    const token = crypto.randomBytes(32).toString('hex');
    const password = user.password;
    const HASH_ROUND = this.configService.numberHashRound;
    const hashedToken = await bcrypt.hash(token, HASH_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);
    const roleId = user.roleId ? user.roleId : this.configService.defaultUserRoleId;

    newUser.id = shortid();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.password = hashedPassword;
    newUser.resetToken = hashedToken;
    newUser.salt = salt;

    const userResult = await this.userRepository.save(newUser);
    await this.aclService.createAclUserRole({
      roleId,
      userId: userResult.id,
    });
    // const mail = new SendMailDto();
    // const resetPasswordLink = `${this.configService.get('HOST')}/reset?token=${token}&uid=${newUser.id}`;

    // mail.from_email = this.configService.get('GMAIL_USER');
    // mail.to_email = user.email;
    // mail.html = `Welcome! Please click on this <a href=${resetPasswordLink}>link</a> to set up your password.`;
    // mail.subject = 'Welcome to Novumstate';

    // await this.mailService.sendMail(mail);
    return userResult;
  }

  updatePassword(dto: UpdatePasswordDto) {
    const { userId, password } = dto;
    return this.userRepository.update(userId, { password });
  }

  // updateUser(id: string, user: UpdateUserDto) {
  //   return this.userRepository.update(id, user);
  // }

  // activateUser(userId: string) {
  //   return this.userRepository.update(userId, { isEnabled: true });
  // }

  // deactivateUser(userId: string) {
  //   return this.userRepository.update(userId, { isEnabled: false });
  // }
}
