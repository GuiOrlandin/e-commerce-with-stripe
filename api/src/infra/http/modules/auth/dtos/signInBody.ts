import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInBody {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password_hash: string;
}
