import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiUsageStore } from './aiUsageStore';
import { estimateTokens } from './estimateTokens';
import { SlidingWindowThrottle } from './slidingWindowThrottle';
import { utcDayString } from './utcDayString';

@Injectable()
export class ChatQuotaService {
  private readonly throttle = new SlidingWindowThrottle();

  constructor(
    private config: ConfigService,
    private usageStore: AiUsageStore,
  ) {}

  /**
   * Throttle + daily token reserve. Throws 401/429; returns estimated tokens consumed.
   */
  async assertAndConsume(userId: string | undefined, message: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const rateLimit = this.config.get<number>('CHAT.rateLimit')!;
    const windowMs = this.config.get<number>('CHAT.rateWindowMs')!;
    const dailyLimit = this.config.get<number>('CHAT.tokenDailyLimit')!;
    const overhead = this.config.get<number>('CHAT.tokenOverhead')!;

    if (!this.throttle.tryHit(userId, rateLimit, windowMs)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Muitas mensagens em pouco tempo. Aguarde um momento.',
          code: 'CHAT_RATE_LIMIT',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const tokens = estimateTokens(message) + overhead;
    if (tokens > dailyLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Mensagem grande demais para a cota diária do chat.',
          code: 'CHAT_TOKEN_QUOTA',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const day = utcDayString();
    const consumed = await this.usageStore.tryConsumeDaily(
      userId,
      day,
      tokens,
      dailyLimit,
    );

    if (!consumed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Cota diária de uso do chat esgotada. Tente amanhã.',
          code: 'CHAT_TOKEN_QUOTA',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return { tokens, day };
  }
}
