import { Body, Controller, Post, Res, Request } from '@nestjs/common';
import { CreateCheckoutBody } from './dtos/createCheckout';
import { CheckOutUseCase } from 'src/modules/checkOut/UseCases/checkOutUseCase';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { Response } from 'express';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutUseCase: CheckOutUseCase) {}

  @Post()
  async checkout(
    @Body() body: CreateCheckoutBody,
    @Res() res: Response,
    @Request() request: AuthRequestModel,
  ) {
    const items = body.items;

    const userId = request.user.id as string;

    const checkoutUrl = await this.checkoutUseCase.execute({ items, userId });

    res.json({ url: checkoutUrl });
  }
}
