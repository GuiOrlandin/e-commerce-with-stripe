import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/productRepository';

interface DeleteProductRequest {
  product_id: string;
  user_id: string;
}

@Injectable()
export class DeleteProductUserUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ product_id, user_id }: DeleteProductRequest) {
    const product = await this.productRepository.findById(product_id);

    if (!product) {
      throw new Error('Produto não encontrado!');
    }

    if (product.user_id !== user_id) {
      throw new Error('Usuário não é o responsável pelo produto!');
    }

    await this.productRepository.delete(product_id);
  }
}
