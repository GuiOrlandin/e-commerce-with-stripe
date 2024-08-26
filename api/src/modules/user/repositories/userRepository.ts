import { User } from '../entities/User';

export interface DataItems {
  amount_total: number;
  purchase_id: string;
  product_id: string;
  name: string;
  description: string;
  image_url: string;
  unit_amount: number;
  quantity: number;
  status: string;
}
export interface AdressItems {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface CheckoutItems {
  data: DataItems[];
}

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<Partial<User> | null>;
  abstract findById(id: string): Promise<Partial<User> | null>;
  abstract save(user: User): Promise<void>;
  abstract SaveCheckoutInUser(
    items: CheckoutItems,
    user: Partial<User>,
    AdressItems: AdressItems,
  ): Promise<void>;
}
