import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateUserBody {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsString()
  @IsOptional()
  adress: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsString()
  @IsOptional()
  _id?: string;
}
