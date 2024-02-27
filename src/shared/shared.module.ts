import { Global, Module } from "@nestjs/common";
import { ConfigService } from "./services/config.service";
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.GMAIL_SMTP_HOST,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})

export class SharedModule {}