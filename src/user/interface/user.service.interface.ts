import type { FilterUser } from '#auth/type/auth.type.js';

export interface IUserService {
  findUserById(id: string): Promise<FilterUser>;
}
