export type DailyUsageSnapshot = {
  tokenEstimate: number;
  requestCount: number;
};

export type ConsumeResult =
  | { ok: true; snapshot: DailyUsageSnapshot }
  | { ok: false; snapshot: DailyUsageSnapshot };

/**
 * In-memory daily token ledger (unit tests + optional single-process fallback).
 * Production chat path persists via PrismaAiUsageStore wrapping the same rules.
 */
export class DailyTokenLedger {
  private readonly byKey = new Map<string, DailyUsageSnapshot>();

  private key(userId: string, day: string) {
    return `${userId}:${day}`;
  }

  snapshot(userId: string, day: string): DailyUsageSnapshot | null {
    return this.byKey.get(this.key(userId, day)) ?? null;
  }

  tryConsume(
    userId: string,
    day: string,
    tokens: number,
    dailyLimit: number,
  ): ConsumeResult {
    const k = this.key(userId, day);
    const current = this.byKey.get(k) ?? {
      tokenEstimate: 0,
      requestCount: 0,
    };

    if (current.tokenEstimate + tokens > dailyLimit) {
      return { ok: false, snapshot: current };
    }

    const next: DailyUsageSnapshot = {
      tokenEstimate: current.tokenEstimate + tokens,
      requestCount: current.requestCount + 1,
    };
    this.byKey.set(k, next);
    return { ok: true, snapshot: next };
  }
}
