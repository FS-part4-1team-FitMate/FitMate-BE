import type { User } from '@prisma/client';
import type { CreateUser, PatchUser } from '#user/type/user.type.js';

export interface IUserService {
  findUserById(id: string): Promise<User>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(id: string, data: PatchUser): Promise<User>;
  deleteUser(id: string): Promise<User>;
}
