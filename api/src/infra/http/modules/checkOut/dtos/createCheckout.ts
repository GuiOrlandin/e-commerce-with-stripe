import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItems {
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
  @Type(() => CheckoutItems)
  items: CheckoutItems[];
}
