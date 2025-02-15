import type { User, SocialAccount } from '@prisma/client';
import type { CreateUser } from '#user/type/user.type.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: CreateUser): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  findSocialAccount(provider: string, providerId: string): Promise<SocialAccount | null>;
  createSocialAccount(userId: string, provider: string, providerId: string): Promise<SocialAccount>;
}
