import { SlidingWindowThrottle } from './slidingWindowThrottle';

describe('SlidingWindowThrottle', () => {
  it('allows up to limit hits inside the window', () => {
    const throttle = new SlidingWindowThrottle();
    const key = 'user-1';
    const now = 1_000_000;

    expect(throttle.tryHit(key, 2, 60_000, now)).toBe(true);
    expect(throttle.tryHit(key, 2, 60_000, now + 1)).toBe(true);
    expect(throttle.tryHit(key, 2, 60_000, now + 2)).toBe(false);
  });

  it('allows hits again after the window slides', () => {
    const throttle = new SlidingWindowThrottle();
    const key = 'user-2';
    const windowMs = 60_000;
    const t0 = 1_000_000;

    expect(throttle.tryHit(key, 1, windowMs, t0)).toBe(true);
    expect(throttle.tryHit(key, 1, windowMs, t0 + 1)).toBe(false);
    expect(throttle.tryHit(key, 1, windowMs, t0 + windowMs + 1)).toBe(true);
  });

  it('isolates keys per user', () => {
    const throttle = new SlidingWindowThrottle();
    const now = 1_000_000;

    expect(throttle.tryHit('a', 1, 60_000, now)).toBe(true);
    expect(throttle.tryHit('b', 1, 60_000, now)).toBe(true);
  });
});
