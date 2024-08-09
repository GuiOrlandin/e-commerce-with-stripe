import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/User';
import {
  CheckoutItems,
  UserRepository,
} from 'src/modules/user/repositories/userRepository';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prismaUserMapper';
import * as fs from 'fs';
import * as path from 'path';
import { JsonObject } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaUserRepository implements UserRepository {
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

  async create(user: User): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new Error('Usuário em uso!');
    }

    const userRaw = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: userRaw,
    });
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const userRaw = PrismaUserMapper.toDomain(user);

    return userRaw;
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    const userRaw = PrismaUserMapper.toDomain(user);

    return userRaw;
  }

  async SaveCheckoutInUser(
    items: CheckoutItems,
    user: Partial<User>,
  ): Promise<void> {
    const userUnmodified = await this.prisma.user.findFirst({
      where: {
        id: user._id,
      },
      select: {
        purchasedProducts: true,
      },
    });


    const existingProducts = Array.isArray(userUnmodified?.purchasedProducts)
      ? userUnmodified.purchasedProducts
      : [];


    const newProducts: JsonObject[] = items.data.map((item) => {
      return {
        description: item.description,
        amount_total: item.amount_total,
        id: item.id,
        price: {
          unit_amount: item.price.unit_amount,
        },
        quantity: item.quantity,
      };
    });

    const updatedPurchasedProducts = [...existingProducts, ...newProducts];

    await this.prisma.user.update({
      where: {
        id: user._id,
      },
      data: {
        purchasedProducts: updatedPurchasedProducts,
      },
    });
  }

  async save(user: User): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);

    const userUnmodified = await this.prisma.user.findFirst({
      where: {
        id: userRaw.id,
      },
    });

    await this.prisma.user.update({
      data: userRaw,
      where: {
        id: userUnmodified.id,
      },
    });
  }
}
