import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/config.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { TokenService } from 'src/token/token.service';
import { PasswordResetRequest } from 'src/token/password-reset-request.entity';
import { AccessToken } from './access-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: AppConfigService) => configService.database,
      inject: [AppConfigService],
      extraProviders: [AppConfigService],
    }),
    TypeOrmModule.forFeature([User, PasswordResetRequest, AccessToken]),
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => {
        return ({
          secret: configService.jwtSecret,
          signOptions: { expiresIn: '24h' },
          global: true
        })
      },
      inject: [AppConfigService],
      extraProviders: [AppConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AppConfigService, TokenService],
  exports: [AuthService]
})

export class AuthModule { }
