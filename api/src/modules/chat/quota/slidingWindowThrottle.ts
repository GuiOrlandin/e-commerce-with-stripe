/**
 * In-process sliding-window throttle.
 * ponytail: single Nest replica only — move hits to Redis when scaling horizontally.
 */
export class SlidingWindowThrottle {
  private readonly hits = new Map<string, number[]>();

  tryHit(
    key: string,
    limit: number,
    windowMs: number,
    now = Date.now(),
  ): boolean {
    const cutoff = now - windowMs;
    const prev = this.hits.get(key) ?? [];
    const recent = prev.filter((t) => t > cutoff);

    if (recent.length >= limit) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}
