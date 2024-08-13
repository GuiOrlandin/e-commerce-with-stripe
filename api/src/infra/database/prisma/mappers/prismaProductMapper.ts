import { Product as ProductRaw } from '@prisma/client';
import { Product } from 'src/modules/products/entities/product';

export class PrismaProductMapper {
  static toPrisma({
    _id,
    category,
    created_at,
    description,
    image_url,
    name,
    stock,
    unit_value,
    user_id,
  }: Product): ProductRaw {
    return {
      id: _id,
      category,
      created_at,
      description,
      image_url,
      name,
      stock,
      unit_value,
      user_id,
    };
  }

  static toDomain({
    id: _id,
    category,
    created_at,
    description,
    image_url,
    name,
    stock,
    unit_value,
    user_id,
  }: ProductRaw): Product {
    return new Product({
      _id,
      category,
      created_at,
      description,
      image_url,
      name,
      stock,
      unit_value,
      user_id,
    });
  }
}
