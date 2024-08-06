import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { SignInDTOValidateMiddleware } from './middleware/singInDTOValidade.middleware';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { ValidateUserUseCase } from 'src/modules/auth/useCase/validateUseCase';
import { SignInUseCase } from 'src/modules/auth/useCase/signInUseCase';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
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
