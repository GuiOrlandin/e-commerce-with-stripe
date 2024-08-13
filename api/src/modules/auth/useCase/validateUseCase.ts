import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import { AuthValueIncorrectException } from '../execptions/authValueIncorrectException';

interface ValidateUserRequest {
  email: string;
  password_hash: string;
}

@Injectable()
export class ValidateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password_hash }: ValidateUserRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AuthValueIncorrectException();
    }

    const userFound = await this.userRepository.findById(user.id);

    const isPasswordMatched = await compare(
      password_hash,
      userFound.password_hash,
    );

    if (!isPasswordMatched) {
      throw new AuthValueIncorrectException();
    }

    return user;
  }
}
