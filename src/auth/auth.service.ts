import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import { IAuthService } from '#auth/interface/auth.service.interface.js';
import type { CreateUser, FilterUser } from '#auth/type/auth.type';
import { UserRepository } from '#user/user.repository.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';
import { hashingPassword, verifyPassword } from '#utils/hashing-password.js';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async createUser(data: CreateUser): Promise<FilterUser> {
    const userEmail = await this.userRepository.findByEmail(data.email);
    if (userEmail) {
      throw new ConflictException(AuthExceptionMessage.USER_EXISTS);
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
    if (!user) throw new NotFoundException(AuthExceptionMessage.EMAIL_NOT_FOUND);
    await verifyPassword(password, user.password);
    return filterSensitiveUserData(user);
  }

  async updateUser(userId: string, refreshToken: string): Promise<FilterUser> {
    const user = await this.userRepository.updateUser(userId, refreshToken);
    return filterSensitiveUserData(user);
  }

  createToken(userId: string, role: string, type: string = 'access'): string {
    const payload = { userId, role };
    const options = { expiresIn: type === 'refresh' ? TOKEN_EXPIRATION.ACCESS : TOKEN_EXPIRATION.REFRESH };
    const jwt = this.jwtService.sign(payload, options);
    return jwt;
  }

  async refreshToken(userId: string, role: string, refreshToken: string): Promise<string> {
    const user = await this.userRepository.findUserById(userId);
    if (!user || user.refreshToken !== refreshToken)
      throw new UnauthorizedException(ExceptionMessages.INVALID_REFRESH_TOKEN);
    return this.createToken(user.id, role);
  }

  async hasProfile(userId: string): Promise<boolean> {
    const profile = await this.profileRepository.findProfileById(userId);
    return !!profile;
  }
}
