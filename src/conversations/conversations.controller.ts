import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { ConversationsService } from './conversations.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {

    constructor(
        private readonly conversationsService:
            ConversationsService,
    ) { }


    @Post()
    create(
        @Req() request: any,

        @Body('title') title?: string,
    ) {

        return this.conversationsService.create(
            request.user.id,
            title || 'New Chat'
        );

    }


    @Get()
    findAll(
        @Req() request: any,
    ) {

        return this.conversationsService.findAll(
            request.user.id
        );

    }


    @Get(':id')
    findOne(
        @Req() request: any,

        @Param('id') id: string,
    ) {

        return this.conversationsService.findOne(
            id,
            request.user.id
        );

    }


    @Patch(':id')
    rename(
        @Req() request: any,

        @Param('id') id: string,

        @Body('title') title: string,
    ) {

        return this.conversationsService.rename(
            id,
            request.user.id,
            title
        );

    }


    @Delete(':id')
    remove(
        @Req() request: any,

        @Param('id') id: string,
    ) {

        return this.conversationsService.remove(
            id,
            request.user.id
        );

    }


    @Post(':id/messages')
    addMessage(
        @Req() request: any,

        @Param('id') id: string,

        @Body('role') role: 'user' | 'assistant',

        @Body('content') content: string,

        @Body('chart') chart?: any,
    ) {

        return this.conversationsService.addMessage(
            id,
            request.user.id,
            role,
            content,
            chart,
        );

    }


    @Delete(':id/messages')
    clearMessages(
        @Req() request: any,

        @Param('id') id: string,
    ) {

        return this.conversationsService.clearMessages(
            id,
            request.user.id
        );

    }

}