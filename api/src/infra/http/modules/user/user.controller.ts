import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/user/useCase/createUserUseCase';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/viewModel';
import { Public } from '../auth/decorators/isPublic';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { FindUserByIdUseCase } from 'src/modules/user/useCase/findUserByIdUseCase';

@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findUserById: FindUserByIdUseCase,
  ) {}

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

  @Get()
  @Public()
  async findUser(@Query('userId') userId: string) {
    const user = await this.findUserById.execute({
      id: userId,
    });

    return user;
  }
}
