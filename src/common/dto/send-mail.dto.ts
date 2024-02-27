import { IsString } from 'class-validator';

export class SendMailDto {
  @IsString()
  from_email: string;

  @IsString()
  to_email: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}
