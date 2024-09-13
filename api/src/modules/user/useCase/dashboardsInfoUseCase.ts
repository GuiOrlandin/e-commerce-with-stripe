import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/userRepository';
import { UserWithoutPermissionException } from '../exceptions/userWithoutPermission';

@Injectable()
export class DashboardInfoUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(user_id: string) {
    const user = await this.userRepository.findById(user_id);

    if (user.role !== 'ADMIN') {
      throw new UserWithoutPermissionException({
        actionName: 'acessar os dados do dashboard',
      });
    }

    const dashboardInfo = await this.userRepository.dashboardInfo();

    return dashboardInfo;
  }
}
