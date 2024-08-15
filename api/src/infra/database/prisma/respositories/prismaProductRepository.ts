import { Injectable } from '@nestjs/common';

import { PrismaUserMapper } from '../mappers/prismaUserMapper';
import * as fs from 'fs';
import * as path from 'path';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';
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

  async create(product: Product): Promise<void> {
    const productRaw = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.create({
      data: productRaw,
    });
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

  async save(product: Product): Promise<void> {}
}
