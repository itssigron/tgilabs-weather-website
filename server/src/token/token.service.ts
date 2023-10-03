import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetRequest } from './password-reset-request.entity';
import { IsEmail, Length, ValidateIf } from 'class-validator';
import { randomBytes } from 'crypto';
import { Match } from 'src/match.decorator';

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    token?: string;

    @ValidateIf((_, value) => value !== undefined) // Only validate if 'password' is provided
    @Length(6, 255)
    password?: string;

    @Match('password', { message: "Passwords don't match." })
    confirmPassword?: string;
}

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(PasswordResetRequest)
        private readonly passwordResetRequestRepository: Repository<PasswordResetRequest>,
    ) { }

    async create(email: string, ageInHours: number): Promise<PasswordResetRequest> {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + ageInHours);

        // create a password-reset record with a random secure token
        const resetRequest = this.passwordResetRequestRepository.create({
            email,
            token: randomBytes(32).toString("hex"),
            expiresAt,
        });

        return await this.passwordResetRequestRepository.save(resetRequest);
    }

    async remove(token: string): Promise<void> {
        const resetRequest = await this.passwordResetRequestRepository.findOne({
            where: { token },
        });

        if (!resetRequest) {
            throw new NotFoundException('Token not found');
        }

        await this.passwordResetRequestRepository.remove(resetRequest);
    }

    async validate(resetPasswordDto: ResetPasswordDto): Promise<string | null> {
        let passwordResetRequest: PasswordResetRequest;

        // Token was not provided
        if (!resetPasswordDto.token) return null;

        // Get request's record from database
        passwordResetRequest = await this.findOneByToken(resetPasswordDto.token);

        // Token was not found
        if (!passwordResetRequest) {
            return null;
        }

        // The token itself exists, but what if it belongs to a different email?
        if (resetPasswordDto.email && passwordResetRequest.email != resetPasswordDto.email) {
            return null;
        }

        // Token has expired
        if (passwordResetRequest.expiresAt <= new Date()) {
            await this.passwordResetRequestRepository.remove(passwordResetRequest); // Delete expired token
            return null;
        }

        // Token is valid, return the user's email
        return passwordResetRequest.email;
    }

    async findOneByToken(token: string) {
        return await this.passwordResetRequestRepository.findOne({ where: { token }, relations: ["user"] });
    }
}
