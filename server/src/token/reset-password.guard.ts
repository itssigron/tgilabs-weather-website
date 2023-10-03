import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ResetPasswordDto, TokenService } from './token.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const token = request.params.token;
    const resetPasswordDto: ResetPasswordDto = { ...body, token };
    const email = await this.tokenService.validate(resetPasswordDto);

    // If not valid, return 401 (Unauthorized)
    if (!email) {
      throw new UnauthorizedException("Invalid token");
    }

    // Otherwise, set the user email and allow access
    request.email = email
    return true;
  }
}
