import type { Profile } from '@prisma/client';
import type { CreateProfile, UpdateProfile } from '#profile/type/profile.type.js';
export interface IProfileService {
  createProfile(data: CreateProfile): Promise<Profile>;
  findProfileById(id: string): Promise<Profile>;
  updateProfile(id: string, data: UpdateProfile): Promise<Profile>;
}
