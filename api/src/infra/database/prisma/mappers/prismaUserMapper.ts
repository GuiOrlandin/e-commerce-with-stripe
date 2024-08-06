import { User } from 'src/modules/user/entities/User';
import { User as UserRaw } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma({
    _id,
    profile_picture,
    created_at,
    email,
    name,
    password_hash,
    adress,
    phone_number,
    role,
    products,
    purchasedProducts,
  }: User): UserRaw {
    return {
      email,
      name,
      password_hash,
      created_at,
      id: _id,
      profile_picture,
      adress,
      phone_number,
      role,
      products,
      purchasedProducts,
    };
  }

  static toDomain({
    email,
    name,
    password_hash,
    created_at,
    id,
    adress,
    phone_number,
    profile_picture,
    role,
  }: UserRaw): User {
    return new User({
      email,
      name,
      password_hash,
      created_at,
      _id: id,
      adress,
      phone_number,
      role,
      profile_picture,
    });
  }
}
