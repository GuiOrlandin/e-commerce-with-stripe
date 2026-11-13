import {
  meteredTokens,
  noteChat,
  recordLlmCall,
  recordUsage,
  runWithUsageMeter,
} from './usageMeter';

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

  it('accumulates LLM calls and keeps the last noted facts', async () => {
    const meter = await runWithUsageMeter(async (m) => {
      recordLlmCall({ model: 'qwen', ms: 100 });
      await Promise.resolve();
      recordLlmCall({ calls: 3 });
      noteChat({ rerank: 'parse_failed', judgeBlocked: true });
      noteChat({ rerank: 'ok' });
      return m;
    });
    expect(meter).toMatchObject({
      model: 'qwen',
      llmCalls: 4,
      llmMs: 100,
      rerank: 'ok',
      judgeBlocked: true,
      fallback: 'none',
    });
  });
});
