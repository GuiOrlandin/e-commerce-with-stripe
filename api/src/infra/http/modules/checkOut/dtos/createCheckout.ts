import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckOutItems {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  unitValue: number;
}

export class CreateCheckoutBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckOutItems)
  items: CheckOutItems[];
}
