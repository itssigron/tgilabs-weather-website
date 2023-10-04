import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(@Inject(AuthService) private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = await this.authService.validateAccessToken(request.cookies['access_token']);
        
        // If not valid, return 401 (Unauthorized)
        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }

        request.user = user;
        return true;
    }
}
