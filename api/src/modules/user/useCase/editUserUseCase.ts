import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/userRepository';
import { UserNotFoundException } from '../exceptions/userDontFound';
import { UserWithoutPermissionException } from '../exceptions/userWithoutPermission';

interface EditUserRequest {
  name?: string;
  adress: string;
  profile_picture?: string;
  user_id: string;
  email: string;
  number: string;
  phone_number: string;
}

@Injectable()
export class EditUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    profile_picture,
    name,
    user_id,
    adress,
    email,
    number,
    phone_number,
  }: EditUserRequest) {
    const user = await this.userRepository.findById(user_id, true);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.id !== user_id) {
      throw new UserWithoutPermissionException({
        actionName: 'editar',
      });
    }

    user.email = email;
    user.number = number;
    user.name = name;
    user.profile_picture = profile_picture;
    user.adress = adress;
    user.phone_number = phone_number;

    await this.userRepository.save(user, {
      adress,
      email,
      name,
      number,
      profile_picture,
      phone_number,
    });

    return user;
  }
}
