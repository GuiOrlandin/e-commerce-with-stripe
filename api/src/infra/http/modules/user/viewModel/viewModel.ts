import { User } from 'src/modules/user/entities/User';

export class UserViewModel {
  static toHttp({ created_at, email, _id, name }: User) {
    return {
      created_at,
      email,
      _id,
      name,
    };
  }
}
