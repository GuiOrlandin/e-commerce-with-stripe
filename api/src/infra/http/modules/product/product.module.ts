import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CreateProductUseCase } from 'src/modules/products/useCase/createProductUseCase';
import { ProductController } from './product.controller';
import { DeleteProductUserUseCase } from 'src/modules/products/useCase/deleteProductUseCase';
import { FindAllProductUseCase } from 'src/modules/products/useCase/findAllProductsUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    DeleteProductUserUseCase,
    FindAllProductUseCase,
  ],
})
export class ProductModule {}
