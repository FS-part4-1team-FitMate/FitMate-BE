import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jsonwebtoken';
import { NoEnvVariableException, UserEmailNotFoundException, UserExistsException } from '#exception/http-exception.js';
import { CreateUser, FilterUser } from '#auth/type/auth.type';
import { UserRepository } from '#user/user.repository.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';
import { hashingPassword, verifyPassword } from '#utils/hashing-password.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(data: CreateUser): Promise<FilterUser> {
    const userEmail = await this.userRepository.findByEmail(data.email);
    if (userEmail) {
      throw new UserExistsException();
    }
    const hashedPassword = await hashingPassword(data.password);
    const { password, ...userWithoutPassword } = data;
    const createUser = await this.userRepository.createUser({
      ...userWithoutPassword,
      password: hashedPassword,
    });
    return filterSensitiveUserData(createUser);
  }

  async getUser(email: string, password: string): Promise<FilterUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UserEmailNotFoundException();
    verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
  }

  createToken(userId: string, type: string = 'access'): string {
    const payload = { userId };
    const options = { expiresIn: type === 'refresh' ? '2w' : '1h' };
    const jwt = this.jwtService.sign(payload, options);
    return jwt;
  }

  async updateUser(userId: string, refreshToken: string): Promise<FilterUser> {
    const user = await this.userRepository.updateUser(userId, refreshToken);
    return filterSensitiveUserData(user);
  }

  // async refreshToken(userId: string, refreshToken: string): Promise<string> {
  //   const user = await this.userRepository.findUserById(userId);
  //   if (!user || user.refreshToken !== refreshToken) {
  //     throw new UnauthorizedException();
  //   }
  //   return this.createToken(user.id);
  // }
}
