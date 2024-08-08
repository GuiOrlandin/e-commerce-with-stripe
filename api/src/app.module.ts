import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { UserModule } from './infra/http/modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infra/http/modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './infra/http/modules/auth/auth.module';
import { CheckoutModule } from './infra/http/modules/checkOut/checkout.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, CheckoutModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
