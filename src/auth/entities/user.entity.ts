import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Conversation } from '../../conversations/conversation.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Conversation,
    conversation => conversation.user
  )
  conversations: Conversation[];
}