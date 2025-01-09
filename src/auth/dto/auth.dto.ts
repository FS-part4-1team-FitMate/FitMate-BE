import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: '이메일 형식이 잘못되었습니다.' })
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/, { message: '비밀번호 형식이 잘못되었습니다.' })
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: '이메일 형식이 잘못되었습니다.' })
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/, { message: '비밀번호 형식이 잘못되었습니다.' })
  password: string;
}
