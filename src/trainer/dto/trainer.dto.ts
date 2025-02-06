import { Gender, LessonType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsEnum, IsIn } from 'class-validator';

export class QueryTrainerDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => value?.split(','))
  @IsEnum(LessonType, { each: true, message: '유효하지 않은 운동 유형입니다.' })
  lessonType?: LessonType[];

  @IsOptional()
  @IsEnum(Gender, { message: '유효하지 않은 성별 값입니다.' })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @IsIn(['reviewCount', 'rating', 'experience', 'lessonCount'], {
    message: '유효하지 않은 정렬 기준입니다.',
  })
  order?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: '유효하지 않은 정렬 방식입니다.' })
  sort?: string;
}
