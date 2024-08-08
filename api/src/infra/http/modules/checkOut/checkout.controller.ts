import { Body, Controller, Post, Res, Request } from '@nestjs/common';
import { CreateCheckoutBody } from './dtos/createCheckout';
import { CheckOutUseCase } from 'src/modules/checkOut/UseCases/checkOutUseCase';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { Response } from 'express';
import { Public } from '../auth/decorators/isPublic';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutUseCase: CheckOutUseCase) {}

  @Post()
  @Public()
  async checkout(
    @Body() body: CreateCheckoutBody,
    @Res() res: Response,
    @Request() request: AuthRequestModel,
  ) {
    const items = body.items;

    // const userId = request.user._id as string;

    const checkoutUrl = await this.checkoutUseCase.execute({ items });

    console.log(checkoutUrl);

    res.json({ url: checkoutUrl });
  }
}
