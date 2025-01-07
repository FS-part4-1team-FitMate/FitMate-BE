import type { Role, User } from '@prisma/client';

export class CreateUser {
  nickname: string;
  email: string;
  password: string;
  role: Role;
}

export type FilterUser = Omit<User, 'password' | 'refreshToken'>;

export class Payload {
  userId: string;
  role: Role;
}
