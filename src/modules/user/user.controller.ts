import { Controller, Get, Query, Param, Post, Put, Body, UseInterceptors } from '@nestjs/common';
// import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserService } from './user.service';
// import { UserInterceptor } from '@/modules/user/user.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findUsers(@Query() query: any) {
    return this.userService.findUsers(query);
  }

  @Post()
  @Roles(Role.admin)
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // @Post('/:userId/activate')
  // @UseInterceptors(UserInterceptor)
  // activateUser(@Param('userId') userId: string) {
  //   return this.userService.activateUser(userId);
  // }

  // @Post('/:userId/deactivate')
  // @UseInterceptors(UserInterceptor)
  // deactivateUser(@Param('userId') userId: string) {
  //   return this.userService.deactivateUser(userId);
  // }

  // @Put('/:userId')
  // @UseInterceptors(UserInterceptor)
  // updateUser(@Param('userId') id: string, @Body() user: UpdateUserDto) {
  //   return this.userService.updateUser(id, user);
  // }
}
