import { Gender, LessonType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsEnum, IsIn } from 'class-validator';

export class QueryTrainerDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEnum(LessonType, { each: true, message: '유효하지 않은 운동 유형입니다.' })
  lessonType?: LessonType[];

  @IsOptional()
  @IsString()
  @IsEnum(Gender, { message: '유효하지 않은 성별 값입니다.' })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @IsIn(['reviewCount', 'rating', 'experience', 'lessonCount'], {
    message: '유효하지 않은 정렬 기준입니다.',
  })
  order?: string = 'reviewCount';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: '유효하지 않은 정렬 방식입니다.' })
  sort?: string = 'desc';

  toCamelCase() {
    return {
      page: this.page,
      limit: this.limit,
      order: this.order,
      sort: this.sort,
      keyword: this.keyword,
      lessonType: this.lessonType,
      gender: this.gender,
    };
  }
}
