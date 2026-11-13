import { lastValueFrom, of, throwError } from 'rxjs';
import { recordUsage } from 'src/modules/chat/quota/usageMeter';
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
});
