import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export default (): { mail: MailerOptions } => ({
    mail: {
        transport: {
            service: process.env.MAIL_SERVICE,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        },
        defaults: {
            from: process.env.MAIL_FROM,
        },
        template: {
            dir: join(require.main.path, "mail/templates"),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        }
    }
});