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
    soldProducts,
    number,
  }: User): UserRaw {
    return {
      email,
      name,
      password_hash,
      created_at,
      id,
      profile_picture,
      phone_number,
      role,
      number,
      purchasedProducts: purchasedProducts
        ? JSON.parse(JSON.stringify(purchasedProducts))
        : null,
      soldProducts: soldProducts
        ? JSON.parse(JSON.stringify(soldProducts))
        : null,
      adress,
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
    number,
    soldProducts,
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
      number,
      profile_picture,
      purchasedProducts: purchasedProducts
        ? JSON.parse(JSON.stringify(purchasedProducts))
        : null,
      soldProducts: soldProducts
        ? JSON.parse(JSON.stringify(soldProducts))
        : null,
    });
  }
}
