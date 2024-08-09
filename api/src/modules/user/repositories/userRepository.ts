import { User } from '../entities/User';

export interface DataItems {
  description: string;
  amount_total: number;
  price: {
    unit_amount: number;
  };
  quantity: number;
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
  ): Promise<void>;
}
