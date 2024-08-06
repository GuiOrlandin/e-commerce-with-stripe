import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/isPublic';
import { AuthRequestModel } from './models/AuthRequestModel';
import { AuthenticatedRequestModel } from './models/authenticateRequestModel';
import { SignInUseCase } from 'src/modules/auth/useCase/signInUseCase';

@Controller()
export class AuthController {
  constructor(private signInUseCase: SignInUseCase) {}

  @Post('signIn')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() request: AuthRequestModel) {
    const access_token = await this.signInUseCase.execute({
      user: request.user,
    });

    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  async test(@Request() request: AuthenticatedRequestModel) {
    return request.user;
  }
}
