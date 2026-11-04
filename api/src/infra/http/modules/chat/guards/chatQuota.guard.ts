import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatQuotaService } from 'src/modules/chat/quota/chatQuotaService';

@Injectable()
export class ChatQuotaGuard implements CanActivate {
  constructor(private chatQuota: ChatQuotaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { id?: string };
      body?: { message?: string };
    }>();
    const userId = request.user?.id;
    const message =
      typeof request.body?.message === 'string' ? request.body.message : '';

    await this.chatQuota.assertAndConsume(userId, message);
    return true;
  }
}
