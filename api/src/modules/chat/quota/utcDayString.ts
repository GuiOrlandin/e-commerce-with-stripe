/** UTC calendar day as YYYY-MM-DD for daily quotas. */
export function utcDayString(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
