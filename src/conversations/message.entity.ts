import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: 'user' | 'assistant';

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  chart: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Conversation,
    conversation => conversation.messages,
    {
      onDelete: 'CASCADE',
    }
  )
  conversation: Conversation;
}