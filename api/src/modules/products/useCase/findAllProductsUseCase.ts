import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/productRepository';

@Injectable()
export class FindAllProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute() {
    const products = await this.productRepository.findAllProducts();

    return products;
  }
}
