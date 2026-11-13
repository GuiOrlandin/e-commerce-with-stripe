import { HttpException } from '@nestjs/common';
import { AiUsageStore } from './aiUsageStore';
import { ChatQuotaService } from './chatQuotaService';

class FakeUsageStore extends AiUsageStore {
  constructor(private readonly result: boolean) {
    super();
  }

  adjustDaily = jest.fn(async () => {});

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

    const store = new FakeUsageStore(opts.consumeOk ?? true);
    const service = new ChatQuotaService({ get: configGet } as never, store);

    return { service, store };
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

  describe('settle', () => {
    const reservation = { userId: 'u1', day: '2026-11-13', reserved: 101 };

    it('charges the difference between real usage and the reserve', async () => {
      const { service, store } = build({});
      await service.settle(reservation, 1800);
      expect(store.adjustDaily).toHaveBeenCalledWith('u1', '2026-11-13', 1699);
    });

    it('keeps the reserve when nothing was metered', async () => {
      const { service, store } = build({});
      await service.settle(reservation, 0);
      expect(store.adjustDaily).not.toHaveBeenCalled();
    });

    it('swallows store failures (reply already sent)', async () => {
      const { service, store } = build({});
      store.adjustDaily.mockRejectedValueOnce(new Error('db down'));
      await expect(service.settle(reservation, 500)).resolves.toBeUndefined();
    });
  });
});
