import { Product } from '../entities/product';
import { ProductRepository } from './productRepository';

export class ProductRepositoryInMemory implements ProductRepository {
  public products: Product[] = [];

  async create(product: Product): Promise<string> {
    this.products.push(product);
    return product._id;
  }

  async updateTextEmbedding(): Promise<void> {}

  async searchByTextEmbedding(): Promise<never[]> {
    return [];
  }

  async searchByKeywords(terms: string[], topK: number) {
    if (terms.length === 0) {
      return [];
    }

    return this.products
      .filter((product) => product.stock >= 1)
      .filter((product) => {
        const text =
          `${product.name} ${product.description ?? ''} ${product.category}`.toLowerCase();
        return terms.every((term) => text.includes(term.toLowerCase()));
      })
      .slice(0, topK)
      .map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description ?? null,
        image_url: product.image_url,
        unit_value: product.unit_value,
        stock: product.stock,
        category: product.category,
        score: 1,
      }));
  }

  async findById(id: string): Promise<Product> {
    const product = this.products.find((product) => product._id === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async delete(product_id: string): Promise<void> {
    this.products.filter((productInStock) => productInStock._id !== product_id);
  }

  async save(product: Product): Promise<void> {
    const productIndex = this.products.findIndex(
      (currentUser) => currentUser._id === product._id,
    );

    if (productIndex >= 0) {
      this.products[productIndex] = product;
    }
  }

  async findAllProducts(): Promise<Product[]> {
    const products = this.products;

    return products;
  }
}
