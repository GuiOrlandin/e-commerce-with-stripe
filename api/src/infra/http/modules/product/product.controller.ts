import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { CreateProductBody } from './dtos/createProductBody';
import { CreateProductUseCase } from 'src/modules/products/useCase/createProductUseCase';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { DeleteProductUserUseCase } from 'src/modules/products/useCase/deleteProductUseCase';
import { Public } from '../auth/decorators/isPublic';
import { FindAllProductUseCase } from 'src/modules/products/useCase/findAllProductsUseCase';

@Controller('product')
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private deleteProductUseCase: DeleteProductUserUseCase,
    private findAllProductsUseCase: FindAllProductUseCase,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @Body() body: CreateProductBody,
    @Request() request: AuthRequestModel,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name, stock, unit_value, created_at, description, category } = body;

    const unitValue = parseFloat(unit_value);
    const stockValue = parseFloat(stock);

    const product = await this.createProductUseCase.execute({
      name,
      stock: stockValue,
      unit_value: unitValue,
      created_at,
      description,
      image_url: file.filename,
      user_id: request.user.id,
      category,
    });

    return product;
  }

  @Get()
  @Public()
  async findAllProducts() {
    const products = await this.findAllProductsUseCase.execute();

    return products;
  }

  @Delete(':id')
  async deletePost(
    @Request() request: AuthRequestModel,
    @Param('id') product_id: string,
  ) {
    await this.deleteProductUseCase.execute({
      product_id,
      user_id: request.user.id,
    });
  }
}
