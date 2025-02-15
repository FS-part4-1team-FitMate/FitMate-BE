import { User } from '@prisma/client';

export function filterSensitiveUserData(data: User) {
  const { password, ...rest } = data;
  return rest;
}
