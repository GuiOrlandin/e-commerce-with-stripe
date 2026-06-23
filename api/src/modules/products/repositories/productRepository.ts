import { Product } from '../entities/product';

export type ProductTextSearchResult = {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  unit_value: number;
  stock: number;
  category: string;
  score: number;
};

export abstract class ProductRepository {
  abstract create(product: Product): Promise<string>;
  abstract delete(product_id: string): Promise<void>;
  abstract findById(id: string): Promise<Partial<Product> | null>;
  abstract findAllProducts(): Promise<Product[] | null>;
  abstract save(product: Product): Promise<void>;
  abstract updateTextEmbedding(
    productId: string,
    embedding: number[],
  ): Promise<void>;
  abstract searchByTextEmbedding(
    embedding: number[],
    topK: number,
  ): Promise<ProductTextSearchResult[]>;
}
