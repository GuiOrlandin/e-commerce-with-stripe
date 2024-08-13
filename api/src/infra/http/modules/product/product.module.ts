import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CreateProductUseCase } from 'src/modules/products/useCase/createProductUseCase';
import { ProductController } from './product.controller';
import { DeleteProductUserUseCase } from 'src/modules/products/useCase/deleteProductUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [CreateProductUseCase, DeleteProductUserUseCase],
})
export class ProductModule {}
