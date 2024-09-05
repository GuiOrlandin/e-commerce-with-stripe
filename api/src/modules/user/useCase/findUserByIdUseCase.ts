import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/userRepository';
import { UserNotFoundException } from '../exceptions/userDontFound';

interface FindUserByIdRequest {
  id: string;
}

@Injectable()
export class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id }: FindUserByIdRequest) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
