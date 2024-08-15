import { Product } from '../entities/product';
import { ProductRepository } from './productRepository';

export class ProductRepositoryInMemory implements ProductRepository {
  public products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
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
