import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { SignInUseCase } from 'src/modules/auth/useCase/signInUseCase';
import { ValidateUserUseCase } from 'src/modules/auth/useCase/validateUseCase';
import { DatabaseModule } from '../../../database/database.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { SignInDTOValidateMiddleware } from './middleware/singInDTOValidade.middleware';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, ValidateUserUseCase, SignInUseCase, JwtStrategy],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInDTOValidateMiddleware).forRoutes('/signIn');
  }
}
