import { HttpException } from '@nestjs/common';
import { AiUsageStore } from './aiUsageStore';
import { ChatQuotaService } from './chatQuotaService';

class FakeUsageStore extends AiUsageStore {
  constructor(private readonly result: boolean) {
    super();
  }

  async tryConsumeDaily(): Promise<boolean> {
    return this.result;
  }
}

describe('ChatQuotaService', () => {
  function build(opts: { rateLimit?: number; consumeOk?: boolean }) {
    const configGet = jest.fn((key: string) => {
      const map: Record<string, unknown> = {
        'CHAT.rateLimit': opts.rateLimit ?? 2,
        'CHAT.rateWindowMs': 60_000,
        'CHAT.tokenDailyLimit': 5000,
        'CHAT.tokenOverhead': 100,
      };
      return map[key];
    });

    const service = new ChatQuotaService(
      { get: configGet } as never,
      new FakeUsageStore(opts.consumeOk ?? true),
    );

    return { service };
  }

  it('rejects missing userId', async () => {
    const { service } = build({});
    await expect(service.assertAndConsume(undefined, 'oi')).rejects.toThrow();
  });

  it('throws 429 CHAT_RATE_LIMIT after exceeding window', async () => {
    const { service } = build({ rateLimit: 1 });

    await service.assertAndConsume('u1', 'oi');
    await expect(service.assertAndConsume('u1', 'oi')).rejects.toBeInstanceOf(
      HttpException,
    );
    try {
      await service.assertAndConsume('u1', 'oi');
    } catch (err) {
      expect((err as HttpException).getResponse()).toMatchObject({
        code: 'CHAT_RATE_LIMIT',
      });
    }
  });

  it('throws 429 CHAT_TOKEN_QUOTA when store denies consume', async () => {
    const { service } = build({ rateLimit: 10, consumeOk: false });

    try {
      await service.assertAndConsume('u1', 'oi');
      throw new Error('expected HttpException');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getResponse()).toMatchObject({
        code: 'CHAT_TOKEN_QUOTA',
      });
    }
  });
});
