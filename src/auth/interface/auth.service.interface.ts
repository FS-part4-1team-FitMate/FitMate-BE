import type { CreateUser, FilterUser, ValidateSocialAccount } from '#auth/type/auth.type.js';

export interface IAuthService {
  createUser(data: CreateUser): Promise<FilterUser>;
  getUser(email: string, password: string): Promise<FilterUser>;
  updateUser(userId: string, refreshToken: string): Promise<FilterUser>;
  createToken(userId: string, role: string, type: string): string;
  refreshToken(userId: string, role: string, refreshToken: string): Promise<string>;
  getGoogleRedirectUrl(role: string): string;
  handleGoogleSignUp(code: string, role: string): Promise<FilterUser>;
  handleGoogleLogin(code: string): Promise<FilterUser>;
  registerSocialAccount({
    provider,
    providerId,
    email,
    nickname,
    role,
  }: ValidateSocialAccount): Promise<FilterUser>;
  loginSocialAccount({
    provider,
    providerId,
  }: Omit<ValidateSocialAccount, 'email' | 'nickname' | 'role'>): Promise<FilterUser>;
}
