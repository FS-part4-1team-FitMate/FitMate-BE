import type { User } from '@prisma/client';
import type { CreateUser } from '#user/type/user.type.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: any): Promise<User>;
  updateUser(id: string, data: any): Promise<User>;
  findUserById(id: string): Promise<User | null>;
}
