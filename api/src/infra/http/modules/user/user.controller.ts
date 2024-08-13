import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/user/useCase/createUserUseCase';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/viewModel';
import { Public } from '../auth/decorators/isPublic';

@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Public()
  async createUser(@Body() body: CreateUserBody) {
    const {
      email,
      name,
      password_hash,
      adress,
      phone_number,
      profile_picture,
    } = body;

    const user = await this.createUserUseCase.execute({
      email,
      name,
      password_hash,
      adress,
      phone_number,
      profile_picture,
    });

    return UserViewModel.toHttp(user);
  }
}
