import type { User } from '@prisma/client';
import type { CreateUser } from '#user/type/user.type.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: CreateUser): Promise<User>;
  updateUser(id: string, refreshToken: string): Promise<User>;
  findUserById(id: string): Promise<User | null>;
}
