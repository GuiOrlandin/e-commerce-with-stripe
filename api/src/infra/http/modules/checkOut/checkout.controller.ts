import {
  Body,
  Controller,
  Post,
  Res,
  Request,
  Query,
  Get,
} from '@nestjs/common';
import { CreateCheckoutBody } from './dtos/createCheckout';
import { CheckOutUseCase } from 'src/modules/checkOut/UseCases/checkOutUseCase';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { Response } from 'express';
import { Public } from '../auth/decorators/isPublic';
import { SuccessCheckOutUseCase } from 'src/modules/checkOut/UseCases/SuccessCheckoutUseCase';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private checkoutUseCase: CheckOutUseCase,
    private successCheckoutUseCase: SuccessCheckOutUseCase,
  ) {}

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

    res.json({ url: checkoutUrl });
  }
  @Get()
  @Public()
  async successCheckout(
    @Res() res: Response,
    @Request() request: AuthRequestModel,
    @Query('sessionId') sessionId: string,
  ) {
    // const userId = request.user._id as string;

    const checkoutUrl = await this.successCheckoutUseCase.execute({
      sessionId,
    });

    res.json({ checkoutUrl });
  }
}
