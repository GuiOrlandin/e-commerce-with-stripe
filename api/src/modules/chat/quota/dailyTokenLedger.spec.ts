import { DailyTokenLedger } from './dailyTokenLedger';

describe('DailyTokenLedger', () => {
  const day = '2026-11-04';

  it('accepts consume under the daily limit and tracks totals', () => {
    const ledger = new DailyTokenLedger();

    expect(ledger.tryConsume('u1', day, 100, 500).ok).toBe(true);
    expect(ledger.tryConsume('u1', day, 200, 500).ok).toBe(true);

    const snap = ledger.snapshot('u1', day)!;
    expect(snap.tokenEstimate).toBe(300);
    expect(snap.requestCount).toBe(2);
  });

  it('rejects when consume would exceed the daily limit', () => {
    const ledger = new DailyTokenLedger();

    expect(ledger.tryConsume('u1', day, 400, 500).ok).toBe(true);
    const denied = ledger.tryConsume('u1', day, 200, 500);

    expect(denied.ok).toBe(false);
    expect(ledger.snapshot('u1', day)!.tokenEstimate).toBe(400);
  });

  it('keeps separate counters per user and day', () => {
    const ledger = new DailyTokenLedger();

    ledger.tryConsume('u1', day, 500, 500);
    expect(ledger.tryConsume('u2', day, 100, 500).ok).toBe(true);
    expect(ledger.tryConsume('u1', '2026-11-05', 100, 500).ok).toBe(true);
  });
});
