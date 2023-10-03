import { MailerOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CookieConfig, CookieOptions } from './cookie.config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) { }

    get appPort(): number {
        return this.configService.get<number>('app.port');
    }

    get weatherApiKey(): string {
        return this.configService.get<string>('weather.apiKey');
    }

    get jwtSecret(): string {
        return this.configService.get<string>('jwt.secret');
    }

    get database(): TypeOrmModuleOptions {
        return this.configService.get<TypeOrmModuleOptions>('database');
    }

    get mail(): MailerOptions {
        return this.configService.get<MailerOptions>('mail');
    }

    getCookie(configName?: string): CookieOptions {
        return this.configService.get<CookieConfig>('cookie')[configName?.trim() ?? 'default'];
    }
}