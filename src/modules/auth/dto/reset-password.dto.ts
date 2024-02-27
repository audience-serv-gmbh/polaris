import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  @IsOptional()
  token: string;

  @ApiProperty({
    required: true,
    default: '',
  })
  @IsString()
  newPassword: string;
}
