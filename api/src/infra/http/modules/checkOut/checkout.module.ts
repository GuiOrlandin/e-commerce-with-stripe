import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CheckoutController } from './checkout.controller';
import { CheckOutUseCase } from 'src/modules/checkOut/UseCases/checkOutUseCase';
import { SuccessCheckOutUseCase } from 'src/modules/checkOut/UseCases/SuccessCheckoutUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [CheckoutController],
  providers: [CheckOutUseCase, SuccessCheckOutUseCase],
})
export class CheckoutModule {}
