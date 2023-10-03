import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendPasswordReset(user: User, token: string, clientUrl: string) {
        const url = `${clientUrl}/reset-password/${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset Your Password',
            template: './passwordReset',
            context: {
                name: user.username,
                url,
            },
        });
    }
}
