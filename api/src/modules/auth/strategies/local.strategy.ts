import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '../useCase/validateUseCase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserUseCase: ValidateUserUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password_hash',
    });
  }

  async validate(email: string, password_hash: string): Promise<any> {
    const user = await this.validateUserUseCase.execute({
      email,
      password_hash,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
