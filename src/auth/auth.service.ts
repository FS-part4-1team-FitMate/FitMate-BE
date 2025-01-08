import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEmailNotFound, UserExistsException } from '#exception/http-exception.js';
import { InvalidRefreshToken } from '#exception/http-exception.js';
import { IAuthService } from '#auth/interface/auth.service.interface.js';
import type { CreateUser, FilterUser } from '#auth/type/auth.type';
import { UserRepository } from '#user/user.repository.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';
import { hashingPassword, verifyPassword } from '#utils/hashing-password.js';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
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
    if (!user) throw new UserEmailNotFound();
    verifyPassword(password, user.password);
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
    if (!user || user.refreshToken !== refreshToken) throw new InvalidRefreshToken();
    return this.createToken(user.id, role);
  }
}
