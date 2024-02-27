import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
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
  password: string;
}
