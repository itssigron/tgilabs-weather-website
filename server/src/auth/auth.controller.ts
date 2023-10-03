import {
    Controller,
    Post,
    Body,
    HttpException,
    InternalServerErrorException,
    Req,
    Res,
    UseGuards,
    HttpStatus,
    Param,
    Get
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ResetPasswordGuard } from 'src/token/reset-password.guard';
import { ResetPasswordDto } from 'src/token/token.service';
import { AppConfigService } from 'src/config/config.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private appConfigService: AppConfigService
    ) { }

    // POST /auth/register handler
    @Post('register')
    async register(@Body() user: User) {
        try {
            // Create the user using the app service
            await this.authService.create(user);

            // Return a success message
            return { message: "User registered successfully!" }
        } catch (error) {
            // re-throw error if its an instance of "HttpException" (an HttpException is an intentional error)
            if (error instanceof HttpException) {
                throw error;
            }

            console.error(error)

            // Return an internal server error response for unknown errors
            throw new InternalServerErrorException(error.toString());
        }
    }

    // POST /auth/login handler
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req, @Res() res: Response) {
        // Create an access token from the user's object and save it in a cookie for 24 hours
        let userData = await this.authService.login(req.user);

        let cookieOptions = {
            ...this.appConfigService.getCookie("default"),
            ...this.appConfigService.getCookie(process.env.NODE_ENV)
        }

        res.cookie("access_token", userData.access_token, cookieOptions)

        // Return a response containing the user data
        res.status(HttpStatus.CREATED).json({ ...userData })
    }

    // POST /auth/request-password-reset handler
    @Post('request-password-reset')
    async requestPasswordReset(@Body() { email }: ResetPasswordDto, @Req() req) {
        try {
            // Use the auth service to handle a "reset password" request
            await this.authService.requestPasswordReset(email, req.get('origin'));

            return { message: "If this email matches an existing account, an email with password-reset instructions will be sent to you." }
        } catch (error) {
            // re-throw error if its an instance of "HttpException" (an HttpException is an intentional error)
            if (error instanceof HttpException) {
                throw error;
            }

            console.error(error)

            // Return an internal server error response for unknown errors
            throw new InternalServerErrorException(error.toString());
        }
    }

    // GET /auth/reset-password/:token handler
    // Here we validate a password-reset request's token, and if valid we return the email
    @Get('reset-password/:token')
    @UseGuards(ResetPasswordGuard)
    async validatePasswordReset(@Req() { email }) {
        return { email }
    }

    // POST /auth/reset-password/:token handler
    // Here we both validating the password-reset request's token AND
    // performing the actual password-reset request
    @Post('reset-password/:token')
    @UseGuards(ResetPasswordGuard)
    async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
        // Perform the password-reset logic
        await this.authService.resetPassword({ ...resetPasswordDto, token });
        return { message: "Your password has been successfully reset." };
    }
}