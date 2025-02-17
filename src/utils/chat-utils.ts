// 닉네임과 프로필 이미지를 가져오는 함수
import { UserService } from '#user/user.service.js';
import { ProfileService } from '#profile/profile.service.js';

export async function fetchUserDetails(
  userId: string,
  userService: UserService,
  profileService: ProfileService,
): Promise<{ nickname: string; profileImage: string | null }> {
  try {
    const user = await userService.findUserById(userId);
    const profile = await profileService.findProfileById(userId);
    return {
      nickname: user.nickname,
      profileImage: profile.profileImagePresignedUrl || null,
    };
  } catch (error) {
    return { nickname: 'Unknown', profileImage: null };
  }
}
