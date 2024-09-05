import { IsString, IsEmail } from 'class-validator';

export class EditUserBody {
  @IsString()
  name: string;

  @IsString()
  adress: string;

  @IsEmail()
  email: string;

  @IsString()
  number: string;
}
