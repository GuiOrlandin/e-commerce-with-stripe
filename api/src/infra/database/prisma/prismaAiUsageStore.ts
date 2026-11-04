import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AiUsageStore } from 'src/modules/chat/quota/aiUsageStore';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaAiUsageStore extends AiUsageStore {
  constructor(private prisma: PrismaService) {
    super();
  }

  async tryConsumeDaily(
    userId: string,
    day: string,
    tokens: number,
    dailyLimit: number,
  ): Promise<boolean> {
    const id = randomUUID();
    const rows = await this.prisma.$executeRaw`
      INSERT INTO user_ai_usage (id, user_id, day, request_count, token_estimate)
      VALUES (${id}, ${userId}, ${day}::date, 1, ${tokens})
      ON CONFLICT (user_id, day)
      DO UPDATE SET
        request_count = user_ai_usage.request_count + 1,
        token_estimate = user_ai_usage.token_estimate + ${tokens}
      WHERE user_ai_usage.token_estimate + ${tokens} <= ${dailyLimit}
    `;
    return rows > 0;
  }
}
