import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/productRepository';

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
  constructor(private productRepository: ProductRepository) {}

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

    await this.productRepository.create(product);

    return product;
  }
}
