import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true, default: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, default: '' })
  @IsString()
  password: string;
}
