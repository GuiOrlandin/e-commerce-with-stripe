import { User } from '../entities/User';
import { UserRepository } from './userRepository';

export class UserRepositoryInMemory implements UserRepository {
  public users: User[] = [];

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
    const user = this.users.find((user) => user._id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  SaveCheckoutInUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex(
      (currentUser) => currentUser._id === user._id,
    );

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
  }
}
