import { lastValueFrom, of, throwError } from 'rxjs';
import { Logger } from '@nestjs/common';
import {
  noteChat,
  recordLlmCall,
  recordUsage,
} from 'src/modules/chat/quota/usageMeter';
import { ChatUsageInterceptor } from './chatUsage.interceptor';

describe('ChatUsageInterceptor', () => {
  const reservation = { userId: 'u1', day: '2026-11-13', reserved: 50 };
  const ctx = (req: object) =>
    ({ switchToHttp: () => ({ getRequest: () => req }) }) as never;

  it('settles the tokens metered while the handler ran', async () => {
    const settle = jest.fn();
    const interceptor = new ChatUsageInterceptor({ settle } as never);

    await lastValueFrom(
      interceptor.intercept(ctx({ chatReservation: reservation }), {
        handle: () => {
          recordUsage(400);
          return of('reply');
        },
      }),
    );

    expect(settle).toHaveBeenCalledWith(reservation, 400);
  });

  it('settles on handler error too', async () => {
    const settle = jest.fn();
    const interceptor = new ChatUsageInterceptor({ settle } as never);

    await expect(
      lastValueFrom(
        interceptor.intercept(ctx({ chatReservation: reservation }), {
          handle: () => {
            recordUsage(70);
            return throwError(() => new Error('ollama down'));
          },
        }),
      ),
    ).rejects.toThrow('ollama down');
    expect(settle).toHaveBeenCalledWith(reservation, 70);
  });

  describe('chat_request log', () => {
    const secret = 'meu cpf é 123.456.789-00';
    const req = {
      user: { id: 'u1' },
      body: { message: secret },
      chatReservation: reservation,
    };
    let log: jest.SpyInstance;
    beforeEach(() => {
      log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    });
    afterEach(() => log.mockRestore());

    const logged = () => {
      expect(log).toHaveBeenCalledTimes(1);
      const line = log.mock.calls[0][0] as string;
      expect(line).not.toContain(secret);
      return JSON.parse(line) as Record<string, unknown>;
    };

    it('emits one line with the request facts on success', async () => {
      const interceptor = new ChatUsageInterceptor({
        settle: jest.fn(),
      } as never);
      await lastValueFrom(
        interceptor.intercept(ctx(req), {
          handle: () => {
            noteChat({ route: 'v2', toolCalled: false, fallback: 'no_tool' });
            recordLlmCall({ model: 'qwen', ms: 12 });
            recordUsage(30);
            noteChat({ matchCount: 2 });
            return of({ reply: secret });
          },
        }),
      );

      expect(logged()).toMatchObject({
        event: 'chat_request',
        route: 'v2',
        userId: 'u1',
        messageChars: secret.length,
        latencyMs: expect.any(Number),
        tokens: 30,
        model: 'qwen',
        llmCalls: 1,
        llmMs: 12,
        toolCalled: false,
        fallback: 'no_tool',
        judgeBlocked: false,
        rerank: 'skipped',
        matchCount: 2,
        status: 'ok',
      });
    });

    it('emits one line with the error class on failure', async () => {
      const interceptor = new ChatUsageInterceptor({
        settle: jest.fn(),
      } as never);
      class OllamaDown extends Error {}
      await expect(
        lastValueFrom(
          interceptor.intercept(ctx(req), {
            handle: () => {
              noteChat({ route: 'v1' });
              return throwError(() => new OllamaDown(secret));
            },
          }),
        ),
      ).rejects.toThrow(OllamaDown);

      expect(logged()).toMatchObject({
        route: 'v1',
        status: 'error',
        error: 'OllamaDown',
      });
    });
  });
});
