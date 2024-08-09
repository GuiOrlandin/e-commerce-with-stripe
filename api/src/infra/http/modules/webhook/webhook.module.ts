import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { SuccessCheckOutUseCase } from 'src/modules/checkOut/UseCases/SuccessCheckoutUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [WebhookController],
  providers: [SuccessCheckOutUseCase],
})
export class WebhookModule {}
