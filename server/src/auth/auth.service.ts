import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './../mail/mail.service';
import { ResetPasswordDto, TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailService: MailService,
        private tokenService: TokenService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(user: Partial<User>): Promise<User> {
        // Check if any of the required fields are missing
        if (!user.username || !user.password || !user.email) {
            throw new BadRequestException('Username, password, and email are required fields.');
        }

        // Validate username length
        if (user.username.length < 3) {
            throw new BadRequestException('Username must be at least 3 characters long.');
        }

        // Validate password length
        if (user.password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long.');
        }

        // Validate email format using a simple regex pattern
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(user.email)) {
            throw new BadRequestException('Invalid email format.');
        }

        // Check if the provided username or email already exists in the database
        const existingUser = await this.userRepository.findOne({
            where: [{ username: user.username }, { email: user.email }],
        });

        if (existingUser) {
            throw new ConflictException('Username or email already exists.');
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = this.userRepository.create({
            ...user,
            password: hashedPassword,
        });

        return await this.userRepository.save(newUser);
    }

    async validateUser(username: string, password: string): Promise<any> {
        // find user by username or email
        const user = await this.userRepository.findOne({ where: [{ username }, { email: username }] });

        // If the user doesnt exists or the password doesnt match (we check it by 
        // compareing the saved hash in the database and the hash of the provided password) then return an unauthorized response
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return null;
        }

        return user;
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        return {
            id: user.id,
            username: user.username,
            access_token: this.jwtService.sign(payload),
        };
    }

    async requestPasswordReset(email: string, clientUrl: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        if (user) {
            // Create a password-reset request that will expire in 24 hours
            const passwordResetReq = await this.tokenService.create(user.email, 24);

            // Send the password-reset email to the user who requested it
            await this.mailService.sendPasswordReset(user, passwordResetReq.token, clientUrl);
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        if (!resetPasswordDto.password) {
            throw new BadRequestException("Password is a required field.")
        }

        // if (resetPasswordDto.password != resetPasswordDto.confirmPassword) {
        //     throw new BadRequestException("Passwords don't match.");
        // }

        // Find the user by email
        let passwordResetRequest = await this.tokenService.findOneByToken(resetPasswordDto.token);

        // Update the user's password, hash it and save it
        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
        passwordResetRequest.user.password = hashedPassword;
        await this.userRepository.save(passwordResetRequest.user);

        // Delete the token after use
        await this.tokenService.remove(resetPasswordDto.token);
    }
}
