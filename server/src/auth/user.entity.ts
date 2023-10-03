import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, Index } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { PasswordResetRequest } from 'src/token/password-reset-request.entity';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 255)
  username: string;

  @Column()
  @Index()
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 255)
  password: string;

  @OneToMany(() => PasswordResetRequest, (resetRequest) => resetRequest.user)
  passwordResetRequests: PasswordResetRequest[];
}
