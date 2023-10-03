import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AppConfigService) appConfigService: AppConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                request => {
                    let accessToken = null;

                    if (request && request.cookies) {
                        accessToken = request.cookies['access_token'];
                    }

                    return accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: appConfigService.jwtSecret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}