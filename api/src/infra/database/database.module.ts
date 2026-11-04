import { Module } from '@nestjs/common';
import { AiUsageStore } from 'src/modules/chat/quota/aiUsageStore';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import { PrismaAiUsageStore } from './prisma/prismaAiUsageStore';
import { PrismaService } from './prisma/prisma.service';
import { PrismaProductRepository } from './prisma/respositories/prismaProductRepository';
import { PrismaUserRepository } from './prisma/respositories/prismaUserRepository';

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
    {
      provide: AiUsageStore,
      useClass: PrismaAiUsageStore,
    },
  ],
  exports: [UserRepository, ProductRepository, PrismaService, AiUsageStore],
})
export class DatabaseModule {}
