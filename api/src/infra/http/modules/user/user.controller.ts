import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/user/useCase/createUserUseCase';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/viewModel';
import { Public } from '../auth/decorators/isPublic';
import { FindUserByIdUseCase } from 'src/modules/user/useCase/findUserByIdUseCase';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { EditUserBody } from './dtos/editUserBody';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EditUserUseCase } from 'src/modules/user/useCase/editUserUseCase';

@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findUserById: FindUserByIdUseCase,
    private editUserUseCase: EditUserUseCase,
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

  @Put()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/userAvatar',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async editUser(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: AuthRequestModel,
    @Body() body: EditUserBody,
  ) {
    const { name, adress, email, number, phone_number } = body;

    if (file) {
      const user = await this.editUserUseCase.execute({
        name,
        adress,
        email,
        number,
        profile_picture: file.filename,
        user_id: request.user.id,
        phone_number,
      });

      return user;
    } else {
      const user = await this.editUserUseCase.execute({
        name,
        adress,
        email,
        number,
        user_id: request.user.id,
        phone_number,
      });

      return user;
    }
  }
}
