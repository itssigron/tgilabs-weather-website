import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ unique: true })
    token: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;
}