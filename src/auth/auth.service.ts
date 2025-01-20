import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import { IAuthService } from '#auth/interface/auth.service.interface.js';
import type { CreateUser, FilterUser, ValidateNaverUser } from '#auth/type/auth.type';
import { UserRepository } from '#user/user.repository.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';
import { hashingPassword, verifyPassword } from '#utils/hashing-password.js';
import mapToRole from '#utils/map-to-role.js';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createUser(data: CreateUser): Promise<FilterUser> {
    const userEmail = await this.userRepository.findByEmail(data.email);
    if (userEmail) throw new ConflictException(AuthExceptionMessage.USER_EXISTS);

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

  getGoogleRedirectUrl(role: string): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    );
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${role}&response_type=code&scope=${scope}&access_type=offline`;
    console.log('url:', url);

    return url;
  }

  async handleGoogleRedirect(code: string, role: Role) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

    const tokenResponse = await firstValueFrom(
      this.httpService.post(tokenUrl, {
        code,
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.configService.get<string>('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      }),
    );
    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await firstValueFrom(
      this.httpService.get(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    const { id: providerId, email, name } = userInfoResponse.data;
    const provider = 'google';

    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (existingAccount) throw new ConflictException(AuthExceptionMessage.USER_EXISTS);

    const user = await this.userRepository.createUser({
      email,
      nickname: name,
      password: '',
      role,
    });

    await this.userRepository.createSocialAccount(user.id, provider, providerId);

    return user;
  }

  async handleNaverRedirect({ provider, providerId, email, nickname }: ValidateNaverUser) {
    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (existingAccount) throw new ConflictException(AuthExceptionMessage.USER_EXISTS);

    const user = await this.userRepository.createUser({
      email,
      nickname,
      password: '',
      role: 'USER',
    });

    await this.userRepository.createSocialAccount(user.id, provider, providerId);

    return user;
  }
}
