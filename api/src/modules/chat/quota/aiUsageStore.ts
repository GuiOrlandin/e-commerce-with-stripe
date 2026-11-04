export abstract class AiUsageStore {
  abstract tryConsumeDaily(
    userId: string,
    day: string,
    tokens: number,
    dailyLimit: number,
  ): Promise<boolean>;
}
