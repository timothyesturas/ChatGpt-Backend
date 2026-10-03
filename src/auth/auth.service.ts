import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import {
  InjectRepository
} from '@nestjs/typeorm';

import {
  Repository
} from 'typeorm';

import {
  JwtService
} from '@nestjs/jwt';

import {
  User
} from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}


  async register(
    email: string,
    password: string
  ) {

    const normalizedEmail =
      email.trim().toLowerCase();


    if (!normalizedEmail || !password) {
      throw new UnauthorizedException(
        'Email and password are required'
      );
    }


    const existingUser =
      await this.userRepository.findOne({
        where: {
          email: normalizedEmail
        }
      });


    if (existingUser) {
      throw new ConflictException(
        'Email is already registered'
      );
    }


    const user =
      this.userRepository.create({
        email: normalizedEmail,
        password
      });


    const savedUser =
      await this.userRepository.save(user);


    return {
      id: savedUser.id,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    };
  }


  async login(
    email: string,
    password: string
  ) {

    const normalizedEmail =
      email.trim().toLowerCase();


    const user =
      await this.userRepository.findOne({
        where: {
          email: normalizedEmail
        }
      });


    if (
      !user ||
      user.password !== password
    ) {

      throw new UnauthorizedException(
        'Invalid email or password'
      );
    }


    const payload = {
      sub: user.id,
      email: user.email
    };


    const accessToken =
      await this.jwtService.signAsync(
        payload
      );


    return {
      access_token: accessToken,

      user: {
        id: user.id,
        email: user.email
      }
    };
  }
}