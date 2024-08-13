import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateProductBody {
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  unit_value: string;

  @IsString()
  @IsOptional()
  stock: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;
}
