import { User } from 'src/modules/user/entities/User';
import { User as UserRaw } from '@prisma/client';

export class PrismaUserMapper {
  static toPrisma({
    id,
    profile_picture,
    created_at,
    email,
    name,
    password_hash,
    adress,
    phone_number,
    role,
    purchasedProducts,
    items_sold,
  }: User): UserRaw {
    return {
      email,
      name,
      password_hash,
      created_at,
      id,
      profile_picture,
      adress,
      phone_number,
      role,
      items_sold: items_sold ? JSON.parse(JSON.stringify(items_sold)) : null,
      purchasedProducts: purchasedProducts
        ? JSON.parse(JSON.stringify(purchasedProducts))
        : null,
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
    purchasedProducts,
    items_sold,
  }: UserRaw): User {
    return new User({
      email,
      name,
      password_hash,
      created_at,
      id,
      adress,
      phone_number,
      role,
      profile_picture,
      items_sold: items_sold ? JSON.parse(JSON.stringify(items_sold)) : null,
      purchasedProducts: purchasedProducts
        ? JSON.parse(JSON.stringify(purchasedProducts))
        : null,
    });
  }
}
