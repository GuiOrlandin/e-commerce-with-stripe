import { meteredTokens, recordUsage, runWithUsageMeter } from './usageMeter';

describe('usageMeter', () => {
  it('sums usage across awaits inside one request', async () => {
    const total = await runWithUsageMeter(async () => {
      recordUsage(10);
      await Promise.resolve();
      recordUsage(5);
      return meteredTokens();
    });
    expect(total).toBe(15);
  });

  it('isolates concurrent requests and ignores calls outside a meter', async () => {
    recordUsage(99);
    expect(meteredTokens()).toBe(0);

    const [a, b] = await Promise.all([
      runWithUsageMeter(async () => {
        recordUsage(1);
        await new Promise((r) => setTimeout(r, 5));
        return meteredTokens();
      }),
      runWithUsageMeter(async () => {
        recordUsage(7);
        return meteredTokens();
      }),
    ]);
    expect([a, b]).toEqual([1, 7]);
  });
});
