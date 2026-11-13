export abstract class AiUsageStore {
  abstract tryConsumeDaily(
    userId: string,
    day: string,
    tokens: number,
    dailyLimit: number,
  ): Promise<boolean>;

  /** Settle actual vs reserved; no limit check (may overshoot, next reserve then blocks). */
  abstract adjustDaily(
    userId: string,
    day: string,
    delta: number,
  ): Promise<void>;
}
