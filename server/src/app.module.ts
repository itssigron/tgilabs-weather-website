import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import generalConfig from './config/general.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import cookieConfig from './config/cookie.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [generalConfig, databaseConfig, mailConfig, cookieConfig]
    }),
    CacheModule.register({
      isGlobal: true
    }),
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService]
})
export class AppModule { }
