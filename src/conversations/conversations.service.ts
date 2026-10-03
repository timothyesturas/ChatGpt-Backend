import {
    Injectable,
    NotFoundException
} from '@nestjs/common';

import {
    InjectRepository
} from '@nestjs/typeorm';

import {
    Repository
} from 'typeorm';

import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

@Injectable()
export class ConversationsService {

    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository:
            Repository<Conversation>,

        @InjectRepository(Message)
        private readonly messageRepository:
            Repository<Message>,
    ) { }


    async create(
        userId: string,
        title = 'New Chat'
    ): Promise<Conversation> {

        const conversation =
            this.conversationRepository.create({

                title,

                user: {
                    id: userId
                }

            });

        return this.conversationRepository.save(
            conversation
        );
    }


    async findAll(
        userId: string
    ): Promise<Conversation[]> {

        return this.conversationRepository.find({

            where: {
                user: {
                    id: userId
                }
            },

            order: {
                updatedAt: 'DESC',
            },

        });

    }


    async findOne(
        id: string,
        userId: string
    ): Promise<Conversation> {

        const conversation =
            await this.conversationRepository.findOne({

                where: {
                    id,

                    user: {
                        id: userId
                    }
                },

                relations: {
                    messages: true,
                },

            });


        if (!conversation) {

            throw new NotFoundException(
                'Conversation not found'
            );

        }


        conversation.messages.sort(
            (a, b) =>
                a.createdAt.getTime() -
                b.createdAt.getTime()
        );


        return conversation;

    }


    async rename(
        id: string,
        userId: string,
        title: string,
    ): Promise<Conversation> {

        const conversation =
            await this.conversationRepository.findOne({

                where: {
                    id,

                    user: {
                        id: userId
                    }
                },

            });


        if (!conversation) {

            throw new NotFoundException(
                'Conversation not found'
            );

        }


        conversation.title =
            title.trim();


        return this.conversationRepository.save(
            conversation
        );

    }


    async remove(
        id: string,
        userId: string
    ): Promise<void> {

        const conversation =
            await this.conversationRepository.findOne({

                where: {
                    id,

                    user: {
                        id: userId
                    }
                },

            });


        if (!conversation) {

            throw new NotFoundException(
                'Conversation not found'
            );

        }


        await this.conversationRepository.remove(
            conversation
        );

    }


    async addMessage(
        conversationId: string,

        userId: string,

        role: 'user' | 'assistant',

        content: string,

        chart?: any,
    ): Promise<Message> {

        const conversation =
            await this.conversationRepository.findOne({

                where: {

                    id: conversationId,

                    user: {
                        id: userId
                    }

                },

            });


        if (!conversation) {

            throw new NotFoundException(
                'Conversation not found'
            );

        }


        const message =
            this.messageRepository.create({

                role,

                content,

                chart: chart ?? null,

                conversation,

            });


        const savedMessage =
            await this.messageRepository.save(
                message
            );


        await this.conversationRepository.save(
            conversation
        );


        return savedMessage;

    }


    async clearMessages(
        conversationId: string,

        userId: string,
    ): Promise<void> {

        const conversation =
            await this.conversationRepository.findOne({

                where: {

                    id: conversationId,

                    user: {
                        id: userId
                    }

                },

            });


        if (!conversation) {

            throw new NotFoundException(
                'Conversation not found'
            );

        }


        await this.messageRepository.delete({

            conversation: {
                id: conversationId
            },

        });


        conversation.title =
            'New Chat';


        await this.conversationRepository.save(
            conversation
        );

    }

}