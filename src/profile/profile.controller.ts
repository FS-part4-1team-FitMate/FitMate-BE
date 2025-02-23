import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDPipe } from '#common/uuid.pipe.js';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { RoleInterceptor } from '#profile/interceptor/role.interceptor.js';
import { ProfileService } from '#profile/profile.service.js';
import { CreateProfileDTO, UpdateProfileDTO } from '#profile/type/profile.dto.js';
import { ProfileResponseDto } from './dto/profile.dto.js';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(RoleInterceptor)
  @ApiOperation({
    summary: '프로필 생성',
    description: '새로운 프로필을 생성합니다. 이미 존재하는 경우 생성할 수 없습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '프로필 생성 성공',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (AccessToken이 유효하지 않음)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 프로필이 존재하여 생성 불가',
  })
  async postProfile(@Body() body: CreateProfileDTO) {
    const { role, ...restBody } = body;

    return this.profileService.createProfile(restBody);
  }

  @Get(':id')
  @ApiOperation({
    summary: '프로필 조회',
    description: '특정 사용자의 프로필을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터 (예: UUID 형식 오류)',
  })
  @ApiResponse({
    status: 404,
    description: '프로필을 찾을 수 없음',
  })
  getProfileById(@Param('id', UUIDPipe) id: string) {
    return this.profileService.findProfileById(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '프로필 수정',
    description: '프로필 정보를 수정합니다. 본인만 수정할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 수정 성공',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (AccessToken이 유효하지 않음)',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음',
  })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchProfile(@Param('id', UUIDPipe) id: string, @Body() body: UpdateProfileDTO) {
    return this.profileService.updateProfile(id, body);
  }
}
