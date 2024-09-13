import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/userRepository';

@Injectable()
export class DashboardInfoUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute() {
    const dashboardInfo = await this.userRepository.dashboardInfo();

    return dashboardInfo;
  }
}
