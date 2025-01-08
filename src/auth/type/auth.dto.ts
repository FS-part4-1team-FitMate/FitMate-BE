import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{10,}$/)
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{10,}$/)
  password: string;
}
