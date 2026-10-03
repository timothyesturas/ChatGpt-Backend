import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service';

@Controller('api/ai')
export class AiController {

  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('messages') messages: any[]) {
    return this.aiService.chat(messages);
  }
}