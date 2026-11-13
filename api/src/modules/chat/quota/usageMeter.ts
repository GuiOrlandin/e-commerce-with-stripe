import { AsyncLocalStorage } from 'async_hooks';

/** Decisions taken while serving one chat request; logged once by ChatUsageInterceptor. */
export type ChatFacts = {
  route?: 'v1' | 'v2';
  model?: string;
  llmCalls: number;
  llmMs: number;
  toolCalled?: boolean;
  fallback: 'none' | 'no_tool' | 'recursion_limit';
  judgeBlocked: boolean;
  judgeReasons?: string[];
  rerank: 'ok' | 'parse_failed' | 'error' | 'skipped';
  matchCount?: number;
};
export type UsageMeter = ChatFacts & { tokens: number };

// One meter per chat request, so deep LLM/embedding calls can report tokens without threading a param through every layer.
const meterStore = new AsyncLocalStorage<UsageMeter>();

/** `fn` gets the meter so callers can read the total after the async context is gone. */
export function runWithUsageMeter<T>(fn: (meter: UsageMeter) => T): T {
  const meter: UsageMeter = {
    tokens: 0,
    llmCalls: 0,
    llmMs: 0,
    fallback: 'none',
    judgeBlocked: false,
    rerank: 'skipped',
  };
  return meterStore.run(meter, () => fn(meter));
}

/** No-op outside a metered request (e.g. product indexing). */
export function recordUsage(tokens: number) {
  const meter = meterStore.getStore();
  if (meter && Number.isFinite(tokens) && tokens > 0) meter.tokens += tokens;
}

export function recordLlmCall(call: {
  model?: string;
  ms?: number;
  calls?: number;
}) {
  const meter = meterStore.getStore();
  if (!meter) return;
  meter.llmCalls += call.calls ?? 1;
  meter.llmMs += call.ms ?? 0;
  if (call.model) meter.model = call.model;
}

/** Last write wins (e.g. the agent may search more than once). */
export function noteChat(facts: Partial<ChatFacts>) {
  const meter = meterStore.getStore();
  if (meter) Object.assign(meter, facts);
}

export function meteredTokens(): number {
  return meterStore.getStore()?.tokens ?? 0;
}
