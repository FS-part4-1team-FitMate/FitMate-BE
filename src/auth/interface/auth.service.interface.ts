import type { CreateUser, FilterUser, ValidateSocialAccount } from '#auth/type/auth.type.js';

export interface IAuthService {
  emailVerification(email: string): Promise<string>;
  verifyEmailCode(email: string, code: string): Promise<boolean>;
  createUser(data: CreateUser): Promise<FilterUser>;
  getUser(email: string, password: string): Promise<FilterUser>;
  updateUser(userId: string, refreshToken: string): Promise<FilterUser>;
  createToken(userId: string, role: string, type: string): string;
  refreshToken(userId: string, role: string, refreshToken: string): Promise<string>;
  getGoogleRedirectUrl(role: string): string;
  handleGoogleSignUp(code: string, role: string): Promise<string | FilterUser>;
  handleGoogleLogin(code: string): Promise<string | FilterUser>;
  registerSocialAccount({
    provider,
    providerId,
    email,
    nickname,
    role,
  }: ValidateSocialAccount): Promise<string | FilterUser>;
  loginSocialAccount({
    provider,
    providerId,
  }: Omit<ValidateSocialAccount, 'email' | 'nickname' | 'role'>): Promise<string | FilterUser>;
  logout(): Promise<void>;
}
