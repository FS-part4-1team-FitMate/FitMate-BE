import type { CreateUser, FilterUser, ValidateSocialAccount } from '#auth/type/auth.type.js';

export interface IAuthService {
  createUser(data: CreateUser): Promise<FilterUser>;
  getUser(email: string, password: string): Promise<FilterUser>;
  updateUser(userId: string, refreshToken: string): Promise<FilterUser>;
  createToken(userId: string, role: string, type: string): string;
  refreshToken(userId: string, role: string, refreshToken: string): Promise<string>;
  getGoogleRedirectUrl(role: string): string;
  handleGoogleRedirect(code: string, role: string): Promise<FilterUser>;
  handleSocialAccount({
    provider,
    providerId,
    email,
    nickname,
    role,
  }: ValidateSocialAccount): Promise<FilterUser>;
}
