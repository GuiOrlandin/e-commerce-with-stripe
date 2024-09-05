import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { UserModule } from './infra/http/modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './infra/http/modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './infra/http/modules/auth/auth.module';
import { CheckoutModule } from './infra/http/modules/checkOut/checkout.module';
import { WebhookModule } from './infra/http/modules/webhook/webhook.module';
import configs from 'config/config';
import { ProductModule } from './infra/http/modules/product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configs],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/files',
      renderPath: '/files/*',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'userAvatar'),
      serveRoot: '/files/userAvatar',
      renderPath: '/files/*',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CheckoutModule,
    WebhookModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
