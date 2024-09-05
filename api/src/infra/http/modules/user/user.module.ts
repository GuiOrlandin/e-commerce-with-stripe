import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/infra/database/database.module';
import { CreateUserUseCase } from 'src/modules/user/useCase/createUserUseCase';
import { FindUserByIdUseCase } from 'src/modules/user/useCase/findUserByIdUseCase';
import { EditUserUseCase } from 'src/modules/user/useCase/editUserUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CreateUserUseCase, FindUserByIdUseCase, EditUserUseCase],
})
export class UserModule {}
