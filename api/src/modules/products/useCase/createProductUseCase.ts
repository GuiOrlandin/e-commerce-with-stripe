import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/productRepository';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import { UserWithoutPermissionException } from 'src/modules/user/exceptions/userWithoutPermission';

interface CreatedProductRequest {
  _id?: string;
  created_at: Date;
  name: string;
  description?: string;
  image_url: string;
  user_id: string;
  category: string;
  unit_value: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    created_at,
    image_url,
    name,
    description,
    unit_value,
    stock,
    user_id,
    category,
  }: CreatedProductRequest) {
    // Product text feeds every user's chat prompt: only admins may write it (indirect prompt injection).
    const user = await this.userRepository.findById(user_id);
    if (user?.role !== 'ADMIN') {
      throw new UserWithoutPermissionException({
        actionName: 'cadastrar produtos',
      });
    }

    const product = new Product({
      created_at,
      image_url,
      name,
      description,
      unit_value,
      stock,
      user_id,
      category,
    });

    const productId = await this.productRepository.create(product);

    return new Product({
      _id: productId,
      created_at,
      image_url,
      name,
      description,
      unit_value,
      stock,
      user_id,
      category,
    });
  }
}
