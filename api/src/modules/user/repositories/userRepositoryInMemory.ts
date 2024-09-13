import { User } from '../entities/User';
import {
  CheckoutItems,
  DashboardItems,
  UserRepository,
} from './userRepository';

import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class UserRepositoryInMemory implements UserRepository {
  public users: User[] = [];

  dashboardInfo(): Promise<DashboardItems[]> {
    throw new Error('Method not implemented.');
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async SaveCheckoutInUser(items: CheckoutItems, user: User): Promise<void> {
    user.purchasedProducts.push(items);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (currentUser) => currentUser.id === user.id,
    );

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
  }

  async getLastSixMonths(): Promise<string[]> {
    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthName = format(monthDate, 'MMMM', { locale: ptBR });
      months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));

      return months;
    }
  }
}
