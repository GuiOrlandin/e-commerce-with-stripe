import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CheckoutController } from './checkout.controller';
import { CheckOutUseCase } from 'src/modules/checkOut/UseCases/checkOutUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [CheckoutController],
  providers: [CheckOutUseCase],
})
export class CheckoutModule {}
