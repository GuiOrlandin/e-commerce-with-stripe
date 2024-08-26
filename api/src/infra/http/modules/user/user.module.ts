import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CreateUserUseCase } from 'src/modules/user/useCase/createUserUseCase';
import { FindUserByIdUseCase } from 'src/modules/user/useCase/findUserByIdUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CreateUserUseCase, FindUserByIdUseCase],
})
export class UserModule {}
