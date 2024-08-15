import { Product } from '../entities/product';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;
  abstract delete(product_id: string): Promise<void>;
  abstract findById(id: string): Promise<Partial<Product> | null>;
  abstract findAllProducts(): Promise<Product[] | null>;
  abstract save(product: Product): Promise<void>;
}
