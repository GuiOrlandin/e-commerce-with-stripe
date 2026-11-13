import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  ChatQuotaService,
  ChatReservation,
} from 'src/modules/chat/quota/chatQuotaService';

@Injectable()
export class ChatQuotaGuard implements CanActivate {
  constructor(private chatQuota: ChatQuotaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { id?: string };
      body?: { message?: string };
      chatReservation?: ChatReservation;
    }>();
    const userId = request.user?.id;
    const message =
      typeof request.body?.message === 'string' ? request.body.message : '';

    const { tokens, day } = await this.chatQuota.assertAndConsume(
      userId,
      message,
    );
    // Read by ChatUsageInterceptor to settle real usage after the handler.
    request.chatReservation = { userId: userId!, day, reserved: tokens };
    return true;
  }
}
