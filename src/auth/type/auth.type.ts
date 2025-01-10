import type { Role, User } from '@prisma/client';

export interface CreateUser {
  nickname: string;
  email: string;
  password: string;
  role: Role;
}

export type FilterUser = Omit<User, 'password' | 'refreshToken'>;

export interface Payload {
  userId: string;
  role: Role;
}
