import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  firstName: string;
  
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  @IsOptional()
  roleId: string;
}
