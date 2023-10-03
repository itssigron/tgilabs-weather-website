import { CookieOptions } from 'express';

export type CookieConfig = { [key: string]: CookieOptions };
export { CookieOptions };

export default (): { cookie: CookieConfig } => ({
    cookie: {
        dev: {
            secure: false
        },
        prod: {
            secure: true
        },
        default: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }
});