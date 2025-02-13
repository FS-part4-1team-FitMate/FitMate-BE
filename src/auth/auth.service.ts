import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import { IAuthService } from '#auth/interface/auth.service.interface.js';
import type { CreateUser, FilterUser, ValidateSocialAccount, SocialAccountInfo } from '#auth/type/auth.type';
import { EmailService } from '#email/email.service.js';
import { UserRepository } from '#user/user.repository.js';
import { ProfileRepository } from '#profile/profile.repository.js';
import { CacheService } from '#cache/cache.service.js';
import { TOKEN_EXPIRATION } from '#configs/jwt.config.js';
import { filterSensitiveUserData } from '#utils/filter-sensitive-user-data.js';
import { getEnvOrThrow } from '#utils/get-env.js';
import { hashingPassword, verifyPassword } from '#utils/hashing-password.js';
import mapToRole from '#utils/map-to-role.js';

@Injectable()
export class AuthService implements IAuthService {
  private readonly frontBaseUrl: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly alsStore: AlsStore,
  ) {
    this.frontBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3000';
  }

  async emailVerification(email: string): Promise<string> {
    const isValid = await this.emailService.validateEmailDomain(email);
    if (!isValid) throw new BadRequestException(AuthExceptionMessage.EMAIL_NOT_FOUND);

    const code = this.emailService.generateVerificationCode();
    await this.emailService.saveVerificationCode(email, code);
    await this.emailService.sendEmail(email, code);
    return code;
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const isValid = await this.emailService.verifyCode(email, code);
    if (!isValid) throw new BadRequestException(AuthExceptionMessage.INVALID_VERIFICATION_CODE);
    await this.emailService.markEmailAsVerified(email);
    return true;
  }

  async createUser(data: CreateUser): Promise<FilterUser> {
    const isVerified = await this.emailService.isEmailVerified(data.email);
    if (!isVerified) throw new BadRequestException(AuthExceptionMessage.EMAIL_NOT_VERIFIED);

    const userEmail = await this.userRepository.findByEmail(data.email);
    if (userEmail) throw new ConflictException(AuthExceptionMessage.USER_EXISTS);

    const hashedPassword = await hashingPassword(data.password);
    const { password, ...userWithoutPassword } = data;
    const createUser = await this.userRepository.createUser({
      ...userWithoutPassword,
      password: hashedPassword,
    });

    await this.emailService.removeEmailVerification(data.email);

    return filterSensitiveUserData(createUser);
  }

  async getUser(email: string, password: string): Promise<FilterUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException(AuthExceptionMessage.EMAIL_NOT_FOUND);

    await verifyPassword(password, user.password);

    return filterSensitiveUserData(user);
  }

  async updateUser(userId: string, refreshToken: string): Promise<FilterUser> {
    await this.cacheService.set(userId, refreshToken, 604800);

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException(AuthExceptionMessage.USER_NOT_FOUND);
    }

    return filterSensitiveUserData(user);
  }

  createToken(userId: string, role: string, type: string = 'access'): string {
    const payload = { userId, role };
    const options = { expiresIn: type === 'refresh' ? TOKEN_EXPIRATION.REFRESH : TOKEN_EXPIRATION.ACCESS };
    const jwt = this.jwtService.sign(payload, options);

    return jwt;
  }

  async refreshToken(userId: string, role: string, refreshToken: string): Promise<string> {
    const { value: storedToken } = await this.cacheService.get(userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException(ExceptionMessages.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new BadRequestException(AuthExceptionMessage.USER_NOT_FOUND);
    return this.createToken(user.id, role);
  }

  async hasProfile(userId: string): Promise<boolean> {
    const profile = await this.profileRepository.findProfileById(userId);

    return !!profile;
  }

  getGoogleRedirectUrl(role?: string): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    );
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${role}&response_type=code&scope=${scope}&access_type=offline`;
    console.log('url:', url);

    return url;
  }

  private async fetchGoogleUserInfo(code: string): Promise<SocialAccountInfo> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

    const tokenResponse = await firstValueFrom(
      this.httpService.post(tokenUrl, {
        code,
        client_id: getEnvOrThrow(this.configService, 'GOOGLE_CLIENT_ID'),
        client_secret: getEnvOrThrow(this.configService, 'GOOGLE_CLIENT_SECRET'),
        redirect_uri: getEnvOrThrow(this.configService, 'GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      }),
    );
    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await firstValueFrom(
      this.httpService.get(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );

    const { id: providerId, email, name: nickname } = userInfoResponse.data;
    const provider = 'google';
    return { provider, providerId, email, nickname };
  }

  async handleGoogleSignUp(code: string, role: string): Promise<string | FilterUser> {
    const { provider, providerId, email, nickname } = await this.fetchGoogleUserInfo(code);

    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (existingAccount)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_EXISTS)}`;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.createUser({
        email,
        nickname,
        password: '',
        role: mapToRole(role),
      });
    }

    await this.userRepository.createSocialAccount(user.id, provider, providerId);

    return filterSensitiveUserData(user);
  }

  async handleGoogleLogin(code: string): Promise<string | FilterUser> {
    const { provider, providerId } = await this.fetchGoogleUserInfo(code);

    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (!existingAccount)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_NOT_FOUND)}`;

    const user = await this.userRepository.findUserById(existingAccount.userId);
    if (!user)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_NOT_FOUND)}`;

    return filterSensitiveUserData(user);
  }

  async registerSocialAccount({
    provider,
    providerId,
    email,
    nickname,
    role,
  }: ValidateSocialAccount): Promise<string | FilterUser> {
    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (existingAccount)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_EXISTS)}`;

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.createUser({
        email,
        nickname,
        password: '',
        role: mapToRole(role),
      });
    }

    await this.userRepository.createSocialAccount(user.id, provider, providerId);

    return filterSensitiveUserData(user);
  }

  async loginSocialAccount({
    provider,
    providerId,
  }: Omit<ValidateSocialAccount, 'email' | 'nickname' | 'role'>): Promise<string | FilterUser> {
    const existingAccount = await this.userRepository.findSocialAccount(provider, providerId);
    if (!existingAccount)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_NOT_FOUND)}`;

    const user = await this.userRepository.findUserById(existingAccount.userId);
    if (!user)
      return `${this.frontBaseUrl}/sns-login?message=${encodeURIComponent(AuthExceptionMessage.USER_NOT_FOUND)}`;

    return filterSensitiveUserData(user);
  }

  async logout(): Promise<void> {
    const { userId } = await this.alsStore.getStore();
    await this.cacheService.del(userId);
  }
}
