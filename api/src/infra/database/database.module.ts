import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import { PrismaUserRepository } from './prisma/respositories/prismaUserRepository';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';
import { PrismaProductRepository } from './prisma/respositories/prismaProductRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [UserRepository, ProductRepository],
})
export class DatabaseModule {}
