import type { User } from '@prisma/client';
import type { CreateUser, PatchUser } from '#user/type/user.type.js';

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(data: PatchUser, id: string): Promise<User>;
  deleteUser(id: string): Promise<User>;
}
