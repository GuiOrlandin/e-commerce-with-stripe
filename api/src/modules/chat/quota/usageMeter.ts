import { AsyncLocalStorage } from 'async_hooks';

// One meter per chat request, so deep LLM/embedding calls can report tokens without threading a param through every layer.
const meterStore = new AsyncLocalStorage<{ tokens: number }>();

/** `fn` gets the meter so callers can read the total after the async context is gone. */
export function runWithUsageMeter<T>(fn: (meter: { tokens: number }) => T): T {
  const meter = { tokens: 0 };
  return meterStore.run(meter, () => fn(meter));
}

/** No-op outside a metered request (e.g. product indexing). */
export function recordUsage(tokens: number) {
  const meter = meterStore.getStore();
  if (meter && Number.isFinite(tokens) && tokens > 0) meter.tokens += tokens;
}

export function meteredTokens(): number {
  return meterStore.getStore()?.tokens ?? 0;
}
