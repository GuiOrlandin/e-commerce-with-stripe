import { Injectable } from '@nestjs/common';
import { vectorToSql } from '../pgvector';

import * as fs from 'fs';
import * as path from 'path';
import {
  ProductRepository,
  ProductTextSearchResult,
} from 'src/modules/products/repositories/productRepository';
import { Product } from 'src/modules/products/entities/product';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mappers/prismaProductMapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  private async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'userAvatar',
      filePath,
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async create(product: Product): Promise<string> {
    const productRaw = PrismaProductMapper.toPrisma(product);

    const created = await this.prisma.product.create({
      data: productRaw,
    });

    return created.id;
  }

  async updateTextEmbedding(
    productId: string,
    embedding: number[],
  ): Promise<void> {
    const vectorSql = vectorToSql(embedding);
    await this.prisma.$executeRaw`
      UPDATE products SET text_embedding = ${vectorSql}::vector WHERE id = ${productId}
    `;
  }

  async searchByTextEmbedding(
    embedding: number[],
    topK: number,
  ): Promise<ProductTextSearchResult[]> {
    const vectorSql = vectorToSql(embedding);
    return this.prisma.$queryRaw<ProductTextSearchResult[]>`
      SELECT
        id, name, description, image_url, unit_value, stock, category,
        1 - (text_embedding <=> ${vectorSql}::vector) AS score
      FROM products
      WHERE text_embedding IS NOT NULL AND stock >= 1
      ORDER BY text_embedding <=> ${vectorSql}::vector
      LIMIT ${topK}
    `;
  }

  async findById(id: string): Promise<Partial<Product> | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async delete(product_id: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: product_id,
      },
    });

    if (!product) {
      throw new Error('O produto não existe!');
    }

    await this.deleteFile(product.image_url);

    await this.prisma.product.delete({
      where: {
        id: product_id,
      },
    });
  }

  async findAllProducts(): Promise<Product[]> {
    const rawProducts = await this.prisma.product.findMany({
      where: {
        stock: {
          gte: 1,
        },
      },
    });

    const products: Product[] = rawProducts.map((record) =>
      PrismaProductMapper.toDomain(record),
    );

    return products;
  }

  async save(product: Product): Promise<void> {
    void product;
  }
}
