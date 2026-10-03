import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Message } from './message.entity';

import { User } from '../auth/entities/user.entity';


@Entity('conversations')
export class Conversation {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    title: string;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @ManyToOne(
        () => User,
        user => user.conversations,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user: User;


    @OneToMany(
        () => Message,
        message => message.conversation,
        {
            cascade: true,
        }
    )
    messages: Message[];

}