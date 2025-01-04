import { User } from '@prisma/client';

export function filterSensitiveUserData(data: User) {
  const { password, refreshToken, ...rest } = data;
  return rest;
}
