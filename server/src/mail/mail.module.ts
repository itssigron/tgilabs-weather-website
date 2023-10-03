import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AppConfigService } from 'src/config/config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) => appConfigService.mail,
      inject: [AppConfigService],
      extraProviders: [AppConfigService]
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
