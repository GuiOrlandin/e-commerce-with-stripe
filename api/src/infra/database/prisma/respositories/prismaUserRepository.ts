import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/User';
import {
  AdressItems,
  CheckoutItems,
  DashboardItems,
  DataItems,
  UserRepository,
  updateItems,
} from 'src/modules/user/repositories/userRepository';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prismaUserMapper';
import * as fs from 'fs';
import * as path from 'path';
import { JsonObject } from '@prisma/client/runtime/library';
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  private async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(
      process.cwd(),
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

    console.log(user);

    const userRaw = PrismaUserMapper.toPrisma(user);

    console.log(userRaw);

    await this.prisma.user.create({
      data: {
        ...userRaw,
        phone_number: null,
        number: null,
        adress: null,
      },
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

  async findById(
    id: string,
    editUser?: boolean,
  ): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    const userRaw = PrismaUserMapper.toDomain(user);

    if (editUser) {
      return userRaw;
    }

    console.log(userRaw);

    return userRaw.toResponseObject();
  }

  async SaveCheckoutInUser(
    items: CheckoutItems,
    user: Partial<User>,
    AdressItems: AdressItems,
  ): Promise<void> {
    const userUnmodified = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        purchasedProducts: true,
      },
    });

    const userAdmin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
      select: {
        soldProducts: true,
        id: true,
      },
    });

    const existingProducts = Array.isArray(userUnmodified?.purchasedProducts)
      ? userUnmodified.purchasedProducts
      : [];

    const existingSoldProductsOfUserAdmin = Array.isArray(
      userAdmin?.soldProducts,
    )
      ? userAdmin.soldProducts
      : [];

    const newProducts: JsonObject[] = items.data.map((item) => {
      return {
        amount_total: item.amount_total,
        id: item.product_id,
        purchase_id: item.purchase_id,
        description: item.description,
        name: item.name,
        image_url: item.image_url,
        unit_amount: item.unit_amount,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        status: item.status,
        adress: {
          city: AdressItems.city,
          country: AdressItems.country,
          adress: AdressItems.line1,
          numberAndNeighborhood: AdressItems.line2,
          postalCode: AdressItems.postal_code,
        },
      };
    });

    const productsId = newProducts.map((product) => product.id as string);
    const productsInDatabase = await this.prisma.product.findMany({
      where: {
        id: { in: productsId },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    const updates = newProducts.map((product) => {
      const currentProductInDb = productsInDatabase.find(
        (productInDb) => productInDb.id === product.id,
      );

      const newStockOfProduct = Math.max(
        currentProductInDb.stock - (product.quantity as number),
        0,
      );

      return {
        where: { id: product.id as string },
        data: { stock: newStockOfProduct },
      };
    });

    await Promise.all(
      updates.map((update) => this.prisma.product.update(update)),
    );

    const updatedPurchasedProducts = [...existingProducts, ...newProducts];

    const updatedSoldProducts = [
      ...existingSoldProductsOfUserAdmin,
      ...newProducts,
    ];

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        purchasedProducts: updatedPurchasedProducts,
      },
    });
    await this.prisma.user.update({
      where: {
        id: userAdmin.id,
      },
      data: {
        soldProducts: updatedSoldProducts,
      },
    });
  }

  async save(user: User, data: updateItems): Promise<void> {
    const userRaw = PrismaUserMapper.toPrisma(user);

    const userUnmodified = await this.prisma.user.findFirst({
      where: {
        id: userRaw.id,
      },
    });

    if (userUnmodified.profile_picture === null) {
      await this.prisma.user.update({
        where: {
          id: userRaw.id,
        },
        data: {
          adress: data.adress,
          email: data.email,
          name: data.name,
          number: data.number,
          profile_picture: data.profile_picture,
          phone_number: data.phone_number,
        },
      });
    }
    if (!user.profile_picture) {
      await this.prisma.user.update({
        where: {
          id: userRaw.id,
        },
        data: {
          adress: data.adress,
          email: data.email,
          name: data.name,
          number: data.number,
          profile_picture: userUnmodified.profile_picture,
          phone_number: data.phone_number,
        },
      });
    }
    if (userUnmodified.profile_picture && user.profile_picture) {
      this.deleteFile(userUnmodified.profile_picture);

      await this.prisma.user.update({
        where: {
          id: userRaw.id,
        },
        data: {
          adress: data.adress,
          email: data.email,
          name: data.name,
          number: data.number,
          profile_picture: data.profile_picture,
          phone_number: data.phone_number,
        },
      });
    }
  }

  async dashboardInfo(): Promise<DashboardItems[]> {
    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthName = format(monthDate, 'MMMM', { locale: ptBR });
      months.push(monthName);
    }

    const sixMonthsAgo = subMonths(new Date(), 6);

    const adminToDomain = PrismaUserMapper.toDomain(admin);

    if (!adminToDomain.soldProducts) {
      throw new Error('Nao foi encontrado os produtos');
    }

    const soldItems = adminToDomain.soldProducts.filter((soldItem) => {
      new Date(soldItem.created_at) >= sixMonthsAgo;

      return soldItem;
    });

    const dashboardData = months
      .map((month) => {
        const productsInMonth = soldItems.filter((soldItemData) => {
          const soldItemDate = format(
            new Date(soldItemData.created_at),
            'MMMM',
            {
              locale: ptBR,
            },
          );

          return soldItemDate.toLowerCase() === month.toLowerCase();
        });

        const totalIncome = productsInMonth.reduce((sum, soldItem) => {
          return sum + soldItem.amount_total;
        }, 0);

        return {
          month,
          soldProducts: productsInMonth,
          totalIncome,
        };
      })
      .reverse();

    return dashboardData;
  }

  async getLastSixMonths(): Promise<string[]> {
    const months: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthName = format(monthDate, 'MMMM', { locale: ptBR });
      months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }

    return months;
  }
}
