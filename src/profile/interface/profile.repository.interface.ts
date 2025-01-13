import type { Profile } from '@prisma/client';
import type { CreateProfile, UpdateProfile } from '#profile/type/profile.type.js';

export interface IProfileRepository {
  findProfileById(id: string): Promise<Profile | null>;
  createProfile(userId: string, data: CreateProfile): Promise<Profile>;
  updateProfile(id: string, data: UpdateProfile): Promise<Profile>;
}
