import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}


  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
    }
  ) {

    return this.authService.register(
      body.email,
      body.password
    );

  }


  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    }
  ) {

    return this.authService.login(
      body.email,
      body.password
    );

  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: any) {

    return request.user;

  }

}