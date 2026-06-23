import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';
import { OllamaService } from './ollama.service';

@Injectable()
export class EmbeddingIndexService {
  constructor(
    private ollama: OllamaService,
    private productRepository: ProductRepository,
  ) {}

  buildProductText(product: {
    name: string;
    description?: string | null;
    category: string;
  }): string {
    return [product.name, product.category, product.description ?? '']
      .filter(Boolean)
      .join(' | ');
  }

  async indexProductText(
    productId: string,
    product: {
      name: string;
      description?: string | null;
      category: string;
    },
  ): Promise<void> {
    const text = this.buildProductText(product);
    const embedding = await this.ollama.embed(text);
    await this.productRepository.updateTextEmbedding(productId, embedding);
  }
}
