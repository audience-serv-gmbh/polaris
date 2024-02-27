import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendMail(mail: any) {
    await this.mailerService.sendMail({
      from: mail.from_email,
      to: mail.to_email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  }
}
